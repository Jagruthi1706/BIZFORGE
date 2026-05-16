# services/design_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def generate_design_service(data: dict) -> dict:
    industry = data.get("industry") or ""
    tone = data.get("tone") or ""

    prompt = f"""
Create a brand design system.

Industry: {industry}
Tone: {tone}

Return ONLY valid JSON (no markdown):
{{
  "palette":[{{"name":"","hex":""}}],
  "fonts":{{"primary":"","secondary":""}},
  "styleGuide":""
}}

Provide 4–6 colors with hex codes. Fonts should be real web font family names.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    palette = parsed.get("palette")
    fonts = parsed.get("fonts")
    if not isinstance(palette, list):
        palette = []
    if not isinstance(fonts, dict):
        fonts = {"primary": "Inter", "secondary": "system-ui"}
    return {
        "palette": palette,
        "fonts": {
            "primary": str(fonts.get("primary", "Inter")),
            "secondary": str(fonts.get("secondary", "system-ui")),
        },
        "styleGuide": str(parsed.get("styleGuide", raw)),
    }
