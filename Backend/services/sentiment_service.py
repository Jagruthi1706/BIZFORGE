# services/sentiment_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def analyze_sentiment_service(data: dict) -> dict:
    text = data.get("reviewText") or data.get("text") or ""

    prompt = f"""
Analyze sentiment of the following text.

Text:
{text}

Return ONLY valid JSON (no markdown):
{{
  "label": "Positive" | "Neutral" | "Negative",
  "confidence": 0.0,
  "insights": "",
  "rewrite": ""
}}

confidence must be between 0 and 1.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    label = str(parsed.get("label", "Neutral"))
    if label not in ("Positive", "Neutral", "Negative"):
        label = "Neutral"
    try:
        conf = float(parsed.get("confidence", 0.5))
    except (TypeError, ValueError):
        conf = 0.5
    conf = max(0.0, min(1.0, conf))
    return {
        "label": label,
        "confidence": conf,
        "insights": str(parsed.get("insights", "")),
        "rewrite": str(parsed.get("rewrite", "")),
    }
