# services/repurpose_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def repurpose_content_service(data: dict) -> dict:
    text = data.get("marketingText") or data.get("content") or ""

    prompt = f"""
Repurpose the following marketing content into multiple formats.

Content:
{text}

Return ONLY valid JSON (no markdown):
{{
  "tweets": ["..."],
  "linkedin": ["..."],
  "instagram": "",
  "newsletter": ""
}}

Provide 4–6 tweets and 2–3 LinkedIn post variants.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    tweets = parsed.get("tweets")
    linkedin = parsed.get("linkedin")
    return {
        "tweets": tweets if isinstance(tweets, list) else [],
        "linkedin": linkedin if isinstance(linkedin, list) else [],
        "instagram": str(parsed.get("instagram", "")),
        "newsletter": str(parsed.get("newsletter", "")),
    }
