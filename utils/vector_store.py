"""
Vector Store Module
Manages sentence embedding generation and vector indexing in Qdrant Vector Database.
"""

import os
from typing import List, Dict, Any, Optional
import logging
from dataclasses import dataclass
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from .text_splitter import ChunkData

logger = logging.getLogger(__name__)


@dataclass
class SearchResult:
    """Dataclass holding search result hit with similarity score and metadata."""
    chunk_id: str
    text: str
    doc_name: str
    page_number: int
    score: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "text": self.text,
            "doc_name": self.doc_name,
            "page_number": self.page_number,
            "score": self.score
        }


class VectorStoreManager:
    """Manager class for Embedding Generation and Qdrant Storage Operations."""

    def __init__(
        self,
        embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        collection_name: str = "pdf_rag_documents",
        qdrant_mode: str = "local",
        qdrant_path: str = "./qdrant_db",
        qdrant_host: str = "localhost",
        qdrant_port: int = 6333,
        qdrant_url: Optional[str] = None,
        qdrant_api_key: Optional[str] = None,
    ):
        self.collection_name = collection_name
        self.embedding_model_name = embedding_model_name

        # Load embedding model
        logger.info(f"Loading embedding model '{embedding_model_name}'...")
        try:
            self.model = SentenceTransformer(embedding_model_name)
            if hasattr(self.model, "get_embedding_dimension"):
                self.vector_size = self.model.get_embedding_dimension()
            else:
                self.vector_size = self.model.get_sentence_embedding_dimension()
            logger.info(f"Embedding model loaded successfully (Vector dimension: {self.vector_size}).")
        except Exception as e:
            logger.error(f"Failed to load embedding model '{embedding_model_name}': {e}")
            raise e

        # Initialize Qdrant client based on mode
        self.client = self._create_qdrant_client(
            qdrant_mode, qdrant_path, qdrant_host, qdrant_port, qdrant_url, qdrant_api_key
        )

    def _create_qdrant_client(
        self,
        mode: str,
        path: str,
        host: str,
        port: int,
        url: Optional[str],
        api_key: Optional[str]
    ) -> QdrantClient:
        """Initializes Qdrant Client based on environment configuration mode."""
        mode = mode.lower()
        logger.info(f"Connecting to Qdrant Vector Store in '{mode}' mode...")

        try:
            if mode == "docker":
                client = QdrantClient(host=host, port=port)
            elif mode == "cloud" and url:
                client = QdrantClient(url=url, api_key=api_key)
            else:
                # Default to local disk storage mode (in-process Qdrant)
                os.makedirs(path, exist_ok=True)
                client = QdrantClient(path=path)

            logger.info("Successfully connected to Qdrant Client.")
            return client
        except Exception as e:
            logger.warning(f"Failed to connect in '{mode}' mode. Falling back to local disk storage mode at './qdrant_db': {e}")
            return QdrantClient(path="./qdrant_db")

    def ensure_collection(self, recreate: bool = False) -> None:
        """Ensures the target vector collection exists in Qdrant."""
        try:
            collections = [c.name for c in self.client.get_collections().collections]

            if recreate and self.collection_name in collections:
                logger.info(f"Recreating collection '{self.collection_name}'...")
                self.client.delete_collection(self.collection_name)
                collections.remove(self.collection_name)

            if self.collection_name not in collections:
                logger.info(f"Creating vector collection '{self.collection_name}' with dim={self.vector_size}...")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=self.vector_size,
                        distance=Distance.COSINE
                    )
                )
                logger.info(f"Collection '{self.collection_name}' created successfully.")
            else:
                logger.info(f"Collection '{self.collection_name}' already exists.")
        except Exception as e:
            logger.error(f"Error ensuring Qdrant collection: {e}")
            raise e

    def add_chunks(self, chunks: List[ChunkData], batch_size: int = 64) -> int:
        """
        Generates embeddings for text chunks and upserts them into Qdrant.

        Args:
            chunks (List[ChunkData]): Chunks to embed and index.
            batch_size (int): Batch size for vector processing.

        Returns:
            int: Count of successfully indexed chunks.
        """
        if not chunks:
            logger.warning("No chunks provided to index.")
            return 0

        self.ensure_collection(recreate=False)
        total_chunks = len(chunks)
        logger.info(f"Indexing {total_chunks} chunk(s) into Qdrant...")

        points: List[PointStruct] = []
        texts = [c.text for c in chunks]

        # Generate embeddings in batch
        embeddings = self.model.encode(texts, show_progress_bar=True, batch_size=batch_size)

        for i, chunk in enumerate(chunks):
            vector = embeddings[i].tolist()
            payload = {
                "chunk_id": chunk.chunk_id,
                "text": chunk.text,
                "doc_name": chunk.doc_name,
                "page_number": chunk.page_number
            }

            points.append(
                PointStruct(
                    id=chunk.chunk_id,
                    vector=vector,
                    payload=payload
                )
            )

        # Batch upsert points
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.client.upsert(
                collection_name=self.collection_name,
                points=batch
            )

        logger.info(f"Successfully indexed {len(points)} chunks into Qdrant collection '{self.collection_name}'.")
        return len(points)

    def similarity_search(self, query: str, top_k: int = 4) -> List[SearchResult]:
        """
        Performs vector search in Qdrant for a given text query.

        Args:
            query (str): The search query.
            top_k (int): Number of top relevant document chunks to retrieve.

        Returns:
            List[SearchResult]: Relevant search results with scores and page metadata.
        """
        if not query or not query.strip():
            return []

        try:
            # Check if collection exists and has points
            collection_info = self.client.get_collection(self.collection_name)
            if collection_info.points_count == 0:
                logger.warning("Qdrant collection is empty. Run `python ingest.py` first.")
                return []

            # Embed user query
            query_vector = self.model.encode(query).tolist()

            # Execute search (supports both client.query_points for qdrant-client>=1.10 and legacy client.search)
            if hasattr(self.client, "query_points"):
                response = self.client.query_points(
                    collection_name=self.collection_name,
                    query=query_vector,
                    limit=top_k
                )
                hits = response.points
            else:
                hits = getattr(self.client, "search")(
                    collection_name=self.collection_name,
                    query_vector=query_vector,
                    limit=top_k
                )

            results: List[SearchResult] = []
            for hit in hits:
                payload = hit.payload or {}
                results.append(
                    SearchResult(
                        chunk_id=payload.get("chunk_id", str(hit.id)),
                        text=payload.get("text", ""),
                        doc_name=payload.get("doc_name", "Unknown"),
                        page_number=payload.get("page_number", 1),
                        score=float(hit.score)
                    )
                )

            return results

        except Exception as e:
            logger.error(f"Error during Qdrant similarity search: {e}")
            return []
