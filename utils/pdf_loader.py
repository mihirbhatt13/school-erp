"""
PDF Loader Module
Handles directory scanning and PDF text extraction with page-level metadata tracking.
"""

import os
from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Any, Optional
import pypdf
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@dataclass
class PDFPageData:
    """Dataclass holding extracted text and metadata for a single PDF page."""
    text: str
    doc_name: str
    page_number: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "text": self.text,
            "doc_name": self.doc_name,
            "page_number": self.page_number
        }


class PDFLoader:
    """PDF Document Loader for scanning directories and extracting text with metadata."""

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)

    def load_all_pdfs(self) -> List[PDFPageData]:
        """
        Scans the data directory and extracts text from all PDF files page-by-page.

        Returns:
            List[PDFPageData]: List of extracted page data objects with metadata.
        """
        if not self.data_dir.exists():
            logger.warning(f"Data directory '{self.data_dir}' does not exist. Creating it.")
            self.data_dir.mkdir(parents=True, exist_ok=True)
            return []

        pdf_files = list(self.data_dir.glob("*.pdf")) + list(self.data_dir.glob("*.PDF"))
        if not pdf_files:
            logger.warning(f"No PDF files found in directory '{self.data_dir.resolve()}'.")
            return []

        logger.info(f"Found {len(pdf_files)} PDF file(s) in '{self.data_dir}'. Starting extraction...")
        pages_data: List[PDFPageData] = []

        for pdf_path in pdf_files:
            extracted_pages = self.load_pdf(pdf_path)
            pages_data.extend(extracted_pages)

        logger.info(f"Successfully extracted {len(pages_data)} total page(s) across {len(pdf_files)} document(s).")
        return pages_data

    def load_pdf(self, file_path: Path) -> List[PDFPageData]:
        """
        Extracts text page-by-page from a single PDF file.

        Args:
            file_path (Path): Path to the PDF file.

        Returns:
            List[PDFPageData]: Extracted page data for the given document.
        """
        file_path = Path(file_path)
        doc_name = file_path.name
        extracted: List[PDFPageData] = []

        try:
            reader = pypdf.PdfReader(file_path)

            if reader.is_encrypted:
                try:
                    reader.decrypt("")
                except Exception as e:
                    logger.error(f"Failed to decrypt encrypted PDF '{doc_name}': {e}")
                    return []

            num_pages = len(reader.pages)
            logger.info(f"Processing '{doc_name}' ({num_pages} pages)...")

            for idx, page in enumerate(reader.pages):
                page_number = idx + 1
                try:
                    text = page.extract_text() or ""
                    cleaned_text = self._clean_text(text)
                    if cleaned_text:
                        extracted.append(
                            PDFPageData(
                                text=cleaned_text,
                                doc_name=doc_name,
                                page_number=page_number
                            )
                        )
                    else:
                        logger.debug(f"Skipped empty text on page {page_number} of '{doc_name}'.")
                except Exception as page_err:
                    logger.error(f"Error reading page {page_number} of '{doc_name}': {page_err}")

        except Exception as e:
            logger.error(f"Failed to parse PDF document '{doc_name}': {e}")

        return extracted

    @staticmethod
    def _clean_text(text: str) -> str:
        """Standardizes line endings and removes redundant whitespaces."""
        if not text:
            return ""
        lines = [line.strip() for line in text.splitlines()]
        cleaned = "\n".join([line for line in lines if line])
        return cleaned.strip()
