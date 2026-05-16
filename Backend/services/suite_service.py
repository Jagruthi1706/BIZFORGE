# services/suite_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def generate_brand_suite_service(data: dict) -> dict:
    industry = data.get("industry") or ""
    desc = data.get("description") or ""
    tone = data.get("tone") or ""
    keywords = data.get("keywords") or ""
    inc_names = bool(data.get("includeNames", True))
    inc_taglines = bool(data.get("includeTaglines", True))
    inc_logos = bool(data.get("includeLogos", False))
    inc_story = bool(data.get("includeStory", True))
    inc_product = bool(data.get("includeProductDesc", False))
    inc_pitch = bool(data.get("includeInvestorPitch", False))

    sections: list[str] = []
    if inc_names:
        sections.append('"names": [{{"name":"","explanation":""}}] (3-8 items)')
    if inc_taglines:
        sections.append('"taglines": [] (3-6 short strings)')
    if inc_logos:
        sections.append(
            '"logos": [{{"url":"https://...","prompt":""}}] (1-2 items, placeholder image URLs OK)'
        )
    if inc_story:
        sections.append('"brandStory": "" (multi-paragraph string)')
    if inc_product:
        sections.append('"productDescriptions": [{{"title":"","content":""}}] (2-4 items)')
    if inc_pitch:
        sections.append(
            '"investorPitch": {{"elevatorPitch":"","problem":"","solution":"","market":"",'
            '"businessModel":"","competitiveAdvantage":"","traction":"","fundingAsk":""}}'
        )

    joined = "\n".join(f"- {s}" for s in sections)

    prompt = f"""
Build a brand suite as a single JSON object (no markdown, no commentary).

Context:
- Industry: {industry}
- Description: {desc}
- Tone: {tone}
- Keywords: {keywords}

Include ONLY these keys (omit any section not listed):
{joined}

Return valid JSON only.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)

    out: dict = {}
    if inc_names and isinstance(parsed.get("names"), list):
        out["names"] = parsed["names"]
    if inc_taglines and isinstance(parsed.get("taglines"), list):
        out["taglines"] = parsed["taglines"]
    if inc_logos and isinstance(parsed.get("logos"), list):
        out["logos"] = parsed["logos"]
    if inc_story and "brandStory" in parsed:
        out["brandStory"] = str(parsed.get("brandStory", ""))
    if inc_product and isinstance(parsed.get("productDescriptions"), list):
        out["productDescriptions"] = parsed["productDescriptions"]
    if inc_pitch and isinstance(parsed.get("investorPitch"), dict):
        out["investorPitch"] = parsed["investorPitch"]

    return out
