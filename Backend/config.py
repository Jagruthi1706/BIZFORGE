"""Central environment configuration (no secrets committed)."""

from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


@lru_cache
def get_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "").strip()
    if raw:
        return [o.strip() for o in raw.split(",") if o.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]


def get_groq_api_key() -> str | None:
    return os.getenv("GROQ_API_KEY")


def get_replicate_token() -> str | None:
    return os.getenv("REPLICATE_API_TOKEN")
