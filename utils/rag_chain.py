"""
RAG Chain Module
Orchestrates vector search, citation assembly, and LLM answer generation.
"""

from dataclasses import dataclass
from typing import List, Dict, Any, Optional
import logging
from .vector_store import VectorStoreManager, SearchResult
from .llm_client import OpenRouterLLMClient

logger = logging.getLogger(__name__)


@dataclass
class Citation:
    """Dataclass holding citation metadata for retrieved document chunks."""
    doc_name: str
    page_number: int
    text_snippet: str
    similarity_score: float

    def to_dict(self) -> Dict[str, Any]:
        return {
            "doc_name": self.doc_name,
            "page_number": self.page_number,
            "text_snippet": self.text_snippet,
            "similarity_score": round(self.similarity_score, 4)
        }


@dataclass
class RAGResponse:
    """Complete RAG response object with LLM answer, citations, and execution status."""
    answer: str
    citations: List[Citation]
    found_in_docs: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "answer": self.answer,
            "citations": [c.to_dict() for c in self.citations],
            "found_in_docs": self.found_in_docs
        }


class RAGChain:
    """RAG Pipeline Orchestrator."""

    NOT_FOUND_MESSAGE = "The information is not available in the supplied documents."

    def __init__(
        self,
        vector_store: VectorStoreManager,
        llm_client: OpenRouterLLMClient,
        min_score_threshold: float = 0.25
    ):
        self.vector_store = vector_store
        self.llm_client = llm_client
        self.min_score_threshold = min_score_threshold

    def query(self, user_query: str, top_k: int = 4) -> RAGResponse:
        """
        Executes the full RAG pipeline for a user query.

        Args:
            user_query (str): The search query.
            top_k (int): Number of context chunks to retrieve.

        Returns:
            RAGResponse: Structured response containing LLM answer and explicit citations.
        """
        user_query = user_query.strip()
        if not user_query:
            return RAGResponse(
                answer="Please provide a valid, non-empty query.",
                citations=[],
                found_in_docs=False
            )

        logger.info(f"Processing user query: '{user_query}'")

        # Step 1: Retrieve relevant chunks from Qdrant vector store
        search_results: List[SearchResult] = self.vector_store.similarity_search(
            query=user_query,
            top_k=top_k
        )

        # Filter out results below threshold
        filtered_results = [r for r in search_results if r.score >= self.min_score_threshold]

        if not filtered_results:
            logger.info("No relevant chunks met the similarity threshold.")
            return RAGResponse(
                answer=self.NOT_FOUND_MESSAGE,
                citations=[],
                found_in_docs=False
            )

        # Build Citations
        citations: List[Citation] = [
            Citation(
                doc_name=res.doc_name,
                page_number=res.page_number,
                text_snippet=res.text,
                similarity_score=res.score
            )
            for res in filtered_results
        ]

        # Step 2: Format context for LLM
        context_snippets = [res.to_dict() for res in filtered_results]

        # Step 3: Generate answer using OpenRouter LLM
        llm_answer = self.llm_client.generate_answer(
            query=user_query,
            context_snippets=context_snippets
        )

        # Double check if LLM returned not found or if info wasn't in documents
        is_found = self.NOT_FOUND_MESSAGE.lower() not in llm_answer.lower()

        return RAGResponse(
            answer=llm_answer,
            citations=citations if is_found else citations,
            found_in_docs=is_found
        )
