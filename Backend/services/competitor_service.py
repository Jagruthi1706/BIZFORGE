# services/competitor_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def analyze_competitor_service(data: dict) -> dict:
    name = data.get("competitorName") or data.get("brandName") or ""
    link = data.get("link") or ""

    prompt = f"""
Analyze this competitor's likely social/content strategy (public signals only).

Competitor name: {name}
Website or profile URL (may be empty): {link}

Return ONLY valid JSON (no markdown):
{{
  "frequency": "",
  "engagement": "",
  "gaps": [],
  "opportunities": [],
  "visualStyle": ""
}}

Use concise strings; gaps and opportunities are string arrays (3–6 items each).
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    gaps = parsed.get("gaps")
    opps = parsed.get("opportunities")
    return {
        "frequency": str(parsed.get("frequency", "")),
        "engagement": str(parsed.get("engagement", "")),
        "gaps": gaps if isinstance(gaps, list) else [],
        "opportunities": opps if isinstance(opps, list) else [],
        "visualStyle": str(parsed.get("visualStyle", "")),
    }
