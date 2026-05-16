# services/brand_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def generate_brand_service(data: dict) -> dict:
    industry = data.get("industry") or ""
    keywords = data.get("keywords") or ""
    tone = data.get("tone") or ""
    gen_names = data.get("generateNames", True)
    gen_taglines = data.get("generateTaglines", True)
    gen_slogans = data.get("generateSlogans", True)

    prompt = f"""
Generate branding assets for this business.

Industry: {industry}
Keywords: {keywords}
Tone: {tone}

Return ONLY valid JSON (no markdown) with this shape:
{{
  "names":[{{"name":"","explanation":""}}],
  "taglines":[],
  "slogans":[]
}}

Rules:
- If the user wants names only, still include empty arrays for unused sections.
- Provide up to 8 names, 6 taglines, 6 slogans as appropriate.
- Names must each include a short explanation string.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)

    out: dict = {}
    if gen_names:
        names = parsed.get("names")
        out["names"] = names if isinstance(names, list) else []
    if gen_taglines:
        taglines = parsed.get("taglines")
        out["taglines"] = taglines if isinstance(taglines, list) else []
    if gen_slogans:
        slogans = parsed.get("slogans")
        out["slogans"] = slogans if isinstance(slogans, list) else []

    return out
