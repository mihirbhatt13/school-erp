"""
Document Ingestion Script
Scans data/ directory, parses PDFs, splits text into chunks, generates embeddings,
and indexes vectors into Qdrant Vector Store.
"""

import os
import sys
import time
import logging
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Load environment configuration
load_dotenv()

from utils.pdf_loader import PDFLoader
from utils.text_splitter import TextSplitter
from utils.vector_store import VectorStoreManager

console = Console()
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")


def run_ingestion(data_dir: str = "data", recreate_collection: bool = True):
    """
    Main ingestion routine.
    """
    start_time = time.time()
    console.print(Panel.fit("[bold blue]PDF Document Ingestion Pipeline[/bold blue]\n[dim]Qdrant Vector Store Indexer[/dim]"))

    # 1. Load PDFs
    loader = PDFLoader(data_dir=data_dir)
    pages = loader.load_all_pdfs()

    if not pages:
        console.print(f"[bold red]Error:[/bold red] No valid PDF pages found in '[yellow]{data_dir}[/yellow]'.")
        console.print("[dim]Please place PDF files inside the data/ folder and run `python ingest.py` again.[/dim]")
        sys.exit(1)

    # 2. Split into chunks
    chunk_size = int(os.getenv("CHUNK_SIZE", 500))
    chunk_overlap = int(os.getenv("CHUNK_OVERLAP", 100))
    splitter = TextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = splitter.split_pages(pages)

    if not chunks:
        console.print("[bold red]Error:[/bold red] Failed to generate text chunks from loaded PDFs.")
        sys.exit(1)

    # 3. Vector Store Connection & Ingestion
    embedding_model = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    collection_name = os.getenv("COLLECTION_NAME", "pdf_rag_documents")
    qdrant_mode = os.getenv("QDRANT_MODE", "local")
    qdrant_path = os.getenv("QDRANT_PATH", "./qdrant_db")
    qdrant_host = os.getenv("QDRANT_HOST", "localhost")
    qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    console.print(f"\n[bold green]Connecting to Qdrant Vector Database ({qdrant_mode} mode)...[/bold green]")
    vector_store = VectorStoreManager(
        embedding_model_name=embedding_model,
        collection_name=collection_name,
        qdrant_mode=qdrant_mode,
        qdrant_path=qdrant_path,
        qdrant_host=qdrant_host,
        qdrant_port=qdrant_port,
        qdrant_url=qdrant_url,
        qdrant_api_key=qdrant_api_key,
    )

    vector_store.ensure_collection(recreate=recreate_collection)

    console.print(f"[bold green]Generating Embeddings and Indexing {len(chunks)} Chunks...[/bold green]")
    indexed_count = vector_store.add_chunks(chunks)

    elapsed_time = round(time.time() - start_time, 2)

    # Ingestion Summary Table
    table = Table(title="[bold cyan]Ingestion Summary[/bold cyan]", show_header=True)
    table.add_column("Metric", style="bold")
    table.add_column("Value", style="green")

    unique_docs = len(set(p.doc_name for p in pages))
    table.add_row("Total Documents Parsed", str(unique_docs))
    table.add_row("Total Pages Processed", str(len(pages)))
    table.add_row("Total Text Chunks Indexed", str(indexed_count))
    table.add_row("Embedding Model", embedding_model)
    table.add_row("Vector Store Mode", qdrant_mode)
    table.add_row("Qdrant Collection", collection_name)
    table.add_row("Execution Time", f"{elapsed_time}s")

    console.print("\n", table)
    console.print("\n[bold gold1]SUCCESS: Ingestion Complete! Ready for Q&A queries.[/bold gold1]\n")


if __name__ == "__main__":
    data_directory = sys.argv[1] if len(sys.argv) > 1 else "data"
    run_ingestion(data_dir=data_directory, recreate_collection=True)
