from __future__ import annotations

import asyncio
import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is not None:
        return _client
    key = os.getenv("GROQ_API_KEY")
    if not key:
        raise ValueError(
            "GROQ_API_KEY is not set. Add it to Backend/.env (see Backend/.env.example)."
        )
    _client = Groq(api_key=key)
    return _client


def _groq_generate_sync(prompt: str) -> str:
    client = _get_client()
    response = client.chat.completions.create(
        model=os.getenv("GROQ_MODEL", "llama3-8b-8192"),
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
    )
    content = response.choices[0].message.content
    return content if content is not None else ""


async def groq_generate_async(prompt: str) -> str:
    return await asyncio.to_thread(_groq_generate_sync, prompt)


def groq_generate(prompt: str) -> str:
    """Sync API used by text generation services."""
    return _groq_generate_sync(prompt)


def groq_configured() -> bool:
    return bool(os.getenv("GROQ_API_KEY"))
