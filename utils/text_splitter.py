"""
Text Splitter Module
Splits document pages into chunks while preserving metadata (document name, page number, chunk ID).
"""

from dataclasses import dataclass
from typing import List, Dict, Any
import uuid
import logging
from .pdf_loader import PDFPageData

logger = logging.getLogger(__name__)


@dataclass
class ChunkData:
    """Dataclass holding a text chunk with document name and page number metadata."""
    chunk_id: str
    text: str
    doc_name: str
    page_number: int

    def to_dict(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "text": self.text,
            "doc_name": self.doc_name,
            "page_number": self.page_number
        }


class TextSplitter:
    """Recursive character text splitter with metadata preservation."""

    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        """
        Args:
            chunk_size (int): Target maximum characters per chunk.
            chunk_overlap (int): Overlap character count between consecutive chunks.
        """
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be strictly less than chunk_size")

        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = ["\n\n", "\n", ". ", " ", ""]

    def split_pages(self, pages: List[PDFPageData]) -> List[ChunkData]:
        """
        Splits a list of PDF pages into chunks, carrying over source document and page number.

        Args:
            pages (List[PDFPageData]): List of page data objects.

        Returns:
            List[ChunkData]: List of processed chunk objects.
        """
        all_chunks: List[ChunkData] = []

        for page in pages:
            raw_text = page.text
            if not raw_text:
                continue

            text_splits = self._recursive_split(raw_text, self.separators)

            for idx, split_text in enumerate(text_splits):
                cleaned_split = split_text.strip()
                if cleaned_split:
                    chunk_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{page.doc_name}-p{page.page_number}-c{idx}-{cleaned_split[:20]}"))
                    all_chunks.append(
                        ChunkData(
                            chunk_id=chunk_id,
                            text=cleaned_split,
                            doc_name=page.doc_name,
                            page_number=page.page_number
                        )
                    )

        logger.info(f"Split {len(pages)} page(s) into {len(all_chunks)} text chunk(s) (size={self.chunk_size}, overlap={self.chunk_overlap}).")
        return all_chunks

    def _recursive_split(self, text: str, separators: List[str]) -> List[str]:
        """Core recursive splitting logic based on separator hierarchy."""
        final_chunks: List[str] = []

        if len(text) <= self.chunk_size:
            return [text]

        # Find best separator
        separator = separators[-1]
        for s in separators:
            if s == "":
                separator = ""
                break
            if s in text:
                separator = s
                break

        splits = text.split(separator) if separator != "" else list(text)

        current_doc: List[str] = []
        current_len = 0

        for s in splits:
            item = s + (separator if separator != "" else "")
            item_len = len(item)

            if current_len + item_len <= self.chunk_size:
                current_doc.append(item)
                current_len += item_len
            else:
                if current_doc:
                    chunk_text = "".join(current_doc).strip()
                    if chunk_text:
                        final_chunks.append(chunk_text)

                # Overlap logic
                overlap_text = "".join(current_doc)
                if len(overlap_text) > self.chunk_overlap:
                    overlap_tail = overlap_text[-self.chunk_overlap:]
                    current_doc = [overlap_tail, item]
                    current_len = len(overlap_tail) + item_len
                else:
                    current_doc = [item]
                    current_len = item_len

        if current_doc:
            chunk_text = "".join(current_doc).strip()
            if chunk_text:
                final_chunks.append(chunk_text)

        return final_chunks
