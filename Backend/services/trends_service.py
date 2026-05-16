# services/trends_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def predict_trends_service(data: dict) -> dict:
    industry = data.get("industry") or ""
    audience = data.get("targetAudience") or data.get("audience") or ""

    prompt = f"""
Predict trends and content opportunities.

Industry: {industry}
Target audience: {audience}

Return ONLY valid JSON (no markdown):
{{
  "topics":[
    {{"topic":"","relevance":0,"urgency":"Low"}}
  ],
  "viralIdea":""
}}

Use urgency values Low, Medium, or High. relevance is 0-100.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    topics = parsed.get("topics")
    if not isinstance(topics, list):
        topics = []
    return {
        "topics": topics,
        "viralIdea": str(parsed.get("viralIdea", "")),
    }
