# Production PDF Retrieval-Augmented Generation (RAG) System

[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Qdrant](https://img.shields.io/badge/VectorDB-Qdrant-red.svg)](https://qdrant.tech/)
[![SentenceTransformers](https://img.shields.io/badge/Embeddings-SentenceTransformers-green.svg)](https://sbert.net/)
[![OpenRouter](https://img.shields.io/badge/LLM-OpenRouter-purple.svg)](https://openrouter.ai/)

A production-grade Retrieval-Augmented Generation (RAG) application built with Python 3.11+. Parses PDF documents, generates local vector embeddings using **Sentence Transformers**, indexes them into **Qdrant**, and performs strict, hallucination-free question answering via **OpenRouter free LLMs** with mandatory page and document citations.

---

## 🏗️ Architecture & Features

- **Document Parsing**: Extracts text page-by-page from PDFs in `data/` while preserving document name and page number metadata.
- **Local Embeddings**: Embeds chunks using `sentence-transformers/all-MiniLM-L6-v2` (384-dim) locally without external API costs.
- **Qdrant Vector Database**: Supports zero-setup Local Disk mode (`./qdrant_db`), local Docker container, or Qdrant Cloud.
- **OpenRouter Free LLM Generation**: Integrates with OpenRouter using models like `meta-llama/llama-3.3-70b-instruct:free` or `google/gemini-2.0-flash-lite-preview-02-05:free`.
- **Strict Anti-Hallucination & Citations**: Returns exact document citations (Document Name, Page Number, Text Snippet) for every answer. Fallback message: *"The information is not available in the supplied documents."* if missing.

---

## 📁 Project Structure

```
├── app.py                 # Main application (CLI interactive chat, single query & Streamlit UI)
├── ingest.py              # PDF parser, chunker & Qdrant vector indexer script
├── requirements.txt       # Production dependencies
├── .env.example           # Environment variables configuration template
├── README.md              # Project documentation
├── data/                  # Input directory for PDF documents
│   └── school_handbook.pdf# Sample PDF document
└── utils/                 # Modular package
    ├── __init__.py        # Package exports
    ├── pdf_loader.py      # PyPDF text extraction & metadata tagger
    ├── text_splitter.py   # Recursive chunking & metadata propagator
    ├── vector_store.py    # Embedding generator & Qdrant client manager
    ├── llm_client.py      # OpenRouter API client with anti-hallucination prompt
    └── rag_chain.py       # Pipeline orchestrator & citation formatter
```

---

## 🚀 Quickstart & Setup

### 1. Prerequisites & Environment Setup
Ensure Python 3.11+ is installed. Clone the repository and set up a virtual environment:

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your OpenRouter API Key (get a free key at [openrouter.ai/keys](https://openrouter.ai/keys)):

```bash
cp .env.example .env
```

*Inside `.env`:*
```ini
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free
QDRANT_MODE=local
```

---

## ⚡ Usage

### Step 1: Ingest PDF Documents
Place your PDF files inside the `data/` folder and execute the ingestion script:

```bash
python ingest.py
```
*This parses all PDFs, generates local embeddings, and populates the Qdrant vector collection.*

### Step 2: Query the RAG Application

#### Interactive CLI Mode
```bash
python app.py
```

#### Single Query CLI Execution
```bash
python app.py "What is the tuition refund policy?"
```

#### Streamlit Web UI Mode
```bash
streamlit run app.py
```

---

## 🧪 Verification & Expected Output

- **Query with information present in PDF:**
  Returns a precise answer accompanied by an explicit citation table listing:
  1. `Document Name` (e.g. `school_handbook.pdf`)
  2. `Page Number` (e.g. `Page 2`)
  3. `Retrieved Text Snippet`

- **Query with information NOT present in PDF:**
  Output: `The information is not available in the supplied documents.`
