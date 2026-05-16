"""Helpers to extract JSON objects from LLM text (markdown fences, trailing prose)."""

from __future__ import annotations

import json
import re
from typing import Any


def parse_json_from_llm(text: str) -> dict[str, Any]:
    if not text or not str(text).strip():
        return {}
    t = str(text).strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", t, re.IGNORECASE)
    if fence:
        t = fence.group(1).strip()
    try:
        out = json.loads(t)
        return out if isinstance(out, dict) else {}
    except json.JSONDecodeError:
        pass
    start, end = t.find("{"), t.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            out = json.loads(t[start : end + 1])
            return out if isinstance(out, dict) else {}
        except json.JSONDecodeError:
            pass
    return {}
