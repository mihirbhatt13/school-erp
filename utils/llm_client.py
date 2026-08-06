"""
LLM Client Module
Handles OpenRouter API interaction using free models with strict anti-hallucination prompts.
"""

import os
from typing import List, Dict, Any, Optional
import logging
from openai import OpenAI

logger = logging.getLogger(__name__)


SYSTEM_PROMPT = """You are a precise, truthful, and strict Retrieval-Augmented Generation (RAG) assistant.

Your task is to answer the user's question using ONLY the provided document context snippets.

STRICT RULES:
1. Rely EXCLUSIVELY on the facts supplied in the context below. Do NOT use outside knowledge, speculate, or extrapolate.
2. If the answer to the user's question cannot be explicitly found in the provided context, your response MUST BE EXACTLY:
   "The information is not available in the supplied documents."
3. Do NOT fabricate, guess, or hallucinate under any circumstances.
4. Keep your answer clear, direct, concise, and truthful to the text.
"""


class OpenRouterLLMClient:
    """Client for generating answers via OpenRouter API with free LLMs."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
    ):
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY", "")
        self.model = model or os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.3-70b-instruct:free")

        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            logger.warning("OPENROUTER_API_KEY is missing or unconfigured. LLM calls will fail until a valid key is set in .env.")

        # OpenRouter API operates via OpenAI client standard specification
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.api_key if self.api_key else "dummy_key_for_init",
            default_headers={
                "HTTP-Referer": "https://github.com/rag-app",
                "X-Title": "RAG PDF Assistant",
            }
        )

    def generate_answer(
        self,
        query: str,
        context_snippets: List[Dict[str, Any]],
        temperature: float = 0.0
    ) -> str:
        """
        Generates an answer from OpenRouter based on retrieved document context.

        Args:
            query (str): The user query.
            context_snippets (List[Dict[str, Any]]): Retrieved snippets with metadata.
            temperature (float): Generation temperature (default 0.0 for deterministic answers).

        Returns:
            str: Generated answer text or exact fallback message if information is missing.
        """
        if not self.api_key or self.api_key == "your_openrouter_api_key_here":
            return "Error: OPENROUTER_API_KEY is not configured in your .env file. Please add a valid key from https://openrouter.ai/keys."

        if not context_snippets:
            return "The information is not available in the supplied documents."

        # Format context block
        context_str_list = []
        for idx, snippet in enumerate(context_snippets, start=1):
            doc = snippet.get("doc_name", "Unknown Document")
            page = snippet.get("page_number", "N/A")
            text = snippet.get("text", "").strip()
            context_str_list.append(
                f"[Source #{idx} | Document: {doc} | Page: {page}]\n{text}"
            )

        formatted_context = "\n\n---\n\n".join(context_str_list)

        user_prompt = f"""DOCUMENT CONTEXT:
{formatted_context}

USER QUESTION:
{query}

ANSWER:"""

        try:
            logger.info(f"Sending prompt to OpenRouter model '{self.model}'...")
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=800
            )

            answer = response.choices[0].message.content
            return answer.strip() if answer else "The information is not available in the supplied documents."

        except Exception as e:
            logger.error(f"OpenRouter API call failed with model '{self.model}': {e}")
            # Try fallback model if the primary model fails or is rate limited
            fallback_models = [
                "google/gemini-2.0-flash-lite-preview-02-05:free",
                "qwen/qwen-2.5-7b-instruct:free",
                "deepseek/deepseek-r1:free"
            ]

            for fb_model in fallback_models:
                if fb_model == self.model:
                    continue
                try:
                    logger.info(f"Attempting fallback model '{fb_model}'...")
                    response = self.client.chat.completions.create(
                        model=fb_model,
                        messages=[
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_prompt}
                        ],
                        temperature=temperature,
                        max_tokens=800
                    )
                    answer = response.choices[0].message.content
                    if answer:
                        return answer.strip()
                except Exception as fb_err:
                    logger.error(f"Fallback model '{fb_model}' failed: {fb_err}")

            return f"API Error: Failed to generate response from OpenRouter ({str(e)})"
