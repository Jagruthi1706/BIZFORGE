"""Input sanitization before LLM / image generation."""

from __future__ import annotations

import re

_INJECTION_PATTERNS = re.compile(
    r"(ignore\s+(all\s+)?(previous|prior)\s+instructions|"
    r"system\s*:|assistant\s*:|<\s*script|javascript:)",
    re.IGNORECASE,
)
_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_text(value: str | None, *, max_len: int = 8000) -> str:
    if value is None:
        return ""
    text = str(value).strip()
    text = _CONTROL_CHARS.sub("", text)
    text = _INJECTION_PATTERNS.sub("", text)
    if len(text) > max_len:
        text = text[:max_len]
    return text.strip()


def require_non_empty(value: str, field_name: str) -> str:
    cleaned = sanitize_text(value)
    if not cleaned:
        raise ValueError(f"{field_name} is required.")
    return cleaned
