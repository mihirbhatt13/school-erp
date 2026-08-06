"""
RAG Application Main Entry Point
Supports Interactive Terminal Chat, Single Command Query, and Streamlit Web Interface.
"""

import os
import sys
import argparse
import logging
from dotenv import load_dotenv
from rich.console import Console
from rich.panel import Panel
from rich.markdown import Markdown
from rich.table import Table

# Load environment configuration
load_dotenv()

from utils.vector_store import VectorStoreManager
from utils.llm_client import OpenRouterLLMClient
from utils.rag_chain import RAGChain, RAGResponse

console = Console()
logging.basicConfig(level=logging.WARNING)


def initialize_rag_chain() -> RAGChain:
    """Instantiates vector store, LLM client, and RAG orchestrator."""
    embedding_model = os.getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    collection_name = os.getenv("COLLECTION_NAME", "pdf_rag_documents")
    qdrant_mode = os.getenv("QDRANT_MODE", "local")
    qdrant_path = os.getenv("QDRANT_PATH", "./qdrant_db")
    qdrant_host = os.getenv("QDRANT_HOST", "localhost")
    qdrant_port = int(os.getenv("QDRANT_PORT", "6333"))
    qdrant_url = os.getenv("QDRANT_URL")
    qdrant_api_key = os.getenv("QDRANT_API_KEY")

    openrouter_key = os.getenv("OPENROUTER_API_KEY", "")
    openrouter_model = os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")

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

    llm_client = OpenRouterLLMClient(
        api_key=openrouter_key,
        model=openrouter_model
    )

    return RAGChain(vector_store=vector_store, llm_client=llm_client)


def print_formatted_response(query: str, response: RAGResponse):
    """Prints answer and mandatory citations in formatted rich console layout."""
    console.print("\n" + "=" * 70)
    console.print(f"[bold cyan]Query:[/bold cyan] {query}\n")

    if not response.found_in_docs:
        console.print(Panel(
            f"[bold red]{response.answer}[/bold red]",
            title="[bold yellow]Result[/bold yellow]",
            border_style="red"
        ))
        console.print("=" * 70 + "\n")
        return

    # Print LLM Answer
    console.print(Panel(
        Markdown(response.answer),
        title="[bold green]RAG Generated Answer[/bold green]",
        border_style="green"
    ))

    # Print mandatory citations details
    if response.citations:
        table = Table(title="[bold yellow]Retrieved Sources & Citations[/bold yellow]", show_lines=True)
        table.add_column("#", style="dim", width=4)
        table.add_column("Document Name", style="bold cyan", width=22)
        table.add_column("Page", style="bold magenta", width=6)
        table.add_column("Score", style="green", width=8)
        table.add_column("Retrieved Text Snippet", style="white")

        for idx, citation in enumerate(response.citations, start=1):
            snippet = citation.text_snippet
            if len(snippet) > 250:
                snippet = snippet[:247] + "..."
            table.add_row(
                str(idx),
                citation.doc_name,
                str(citation.page_number),
                f"{citation.similarity_score:.4f}",
                snippet
            )

        console.print(table)

    console.print("=" * 70 + "\n")


def run_cli_mode(rag_chain: RAGChain, initial_query: str = None):
    """Runs interactive terminal loop or single CLI query execution."""
    if initial_query:
        response = rag_chain.query(initial_query)
        print_formatted_response(initial_query, response)
        return

    console.print(Panel.fit(
        "[bold cyan]Production PDF RAG Question Answering System[/bold cyan]\n"
        "[dim]Type your question below or type 'exit' / 'quit' to end.[/dim]",
        border_style="cyan"
    ))

    while True:
        try:
            user_input = console.input("[bold yellow]Ask a question > [/bold yellow]").strip()
            if not user_input:
                continue
            if user_input.lower() in ["exit", "quit", "q"]:
                console.print("[dim]Goodbye![/dim]")
                break

            response = rag_chain.query(user_input)
            print_formatted_response(user_input, response)

        except (KeyboardInterrupt, EOFError):
            console.print("\n[dim]Session terminated.[/dim]")
            break


def run_streamlit_app():
    """Streamlit Web UI mode for interactive visual demo."""
    import streamlit as st

    st.set_page_config(
        page_title="PDF RAG Assistant",
        page_icon="📚",
        layout="wide"
    )

    st.title("📚 PDF Retrieval-Augmented Generation (RAG)")
    st.markdown("Query uploaded PDF documents with Qdrant vector retrieval and free OpenRouter LLMs.")

    # Sidebar configuration
    with st.sidebar:
        st.header("⚙️ Configuration")
        st.info(f"**Embedding Model:** `{os.getenv('EMBEDDING_MODEL_NAME', 'sentence-transformers/all-MiniLM-L6-v2')}`")
        st.info(f"**Vector Store Mode:** `{os.getenv('QDRANT_MODE', 'local')}`")
        st.info(f"**OpenRouter Model:** `{os.getenv('OPENROUTER_MODEL', 'meta-llama/llama-3.3-70b-instruct:free')}`")

        if st.button("🔄 Re-initialize RAG Pipeline"):
            st.cache_resource.clear()
            st.success("Pipeline reloaded!")

    @st.cache_resource
    def load_cached_chain():
        return initialize_rag_chain()

    try:
        rag_chain = load_cached_chain()
    except Exception as e:
        st.error(f"Failed to initialize RAG pipeline: {e}")
        st.stop()

    # Query Input Form
    query = st.text_input("Enter your question about the uploaded documents:", placeholder="e.g. What is the fee refund policy?")

    if st.button("Submit Query", type="primary") and query:
        with st.spinner("Searching vectors & generating answer..."):
            response = rag_chain.query(query)

        st.subheader("💡 Answer")
        if not response.found_in_docs:
            st.warning(response.answer)
        else:
            st.success(response.answer)

            st.subheader("📑 Retrieved Sources & Citations")
            for idx, cit in enumerate(response.citations, 1):
                with st.expander(f"Source #{idx} — Document: **{cit.doc_name}** | Page: **{cit.page_number}** (Score: {cit.similarity_score:.4f})"):
                    st.write(f"**Document Name:** `{cit.doc_name}`")
                    st.write(f"**Page Number:** `{cit.page_number}`")
                    st.write(f"**Retrieved Text Snippet:**")
                    st.code(cit.text_snippet, language=None)


if __name__ == "__main__":
    # Check if executed via Streamlit CLI
    if "streamlit" in sys.argv[0] or (len(sys.argv) > 1 and sys.argv[1] == "--web"):
        run_streamlit_app()
    else:
        parser = argparse.ArgumentParser(description="PDF RAG Assistant CLI")
        parser.add_argument("query", nargs="?", type=str, help="Optional single query to execute")
        args = parser.parse_args()

        chain = initialize_rag_chain()
        run_cli_mode(chain, initial_query=args.query)
