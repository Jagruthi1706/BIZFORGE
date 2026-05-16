# services/growth_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def analyze_growth_service(data: dict) -> dict:
    urls = {
        "instagram": data.get("instagramUrl"),
        "linkedin": data.get("linkedinUrl"),
        "twitter": data.get("twitterUrl"),
        "facebook": data.get("facebookUrl"),
        "youtube": data.get("youtubeUrl"),
    }

    prompt = f"""
You cannot fetch live metrics. Based on typical platform patterns and the URLs provided (may be empty),
propose a plausible baseline audit and growth plan as JSON only.

Provided URLs (values may be null): {urls}

Return ONLY valid JSON (no markdown):
{{
  "platformMetrics":[
    {{"platform":"","followers":0,"engagement":"","growth":""}}
  ],
  "totalFollowers": 0,
  "forecast":[
    {{"month":"Month 1","followers":0}}
  ],
  "contentRecommendations":[""]
}}

Use 3 monthly forecast points. totalFollowers should equal the sum of followers in platformMetrics.
If no URLs, still return one generic "Combined" metric with zeros and helpful recommendations.
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    metrics = parsed.get("platformMetrics")
    forecast = parsed.get("forecast")
    recs = parsed.get("contentRecommendations")
    if not isinstance(metrics, list):
        metrics = []
    if not isinstance(forecast, list):
        forecast = []
    if not isinstance(recs, list):
        recs = []
    try:
        total = int(parsed.get("totalFollowers", 0))
    except (TypeError, ValueError):
        total = 0
    if not total and isinstance(metrics, list):
        for m in metrics:
            if isinstance(m, dict):
                try:
                    total += int(m.get("followers", 0))
                except (TypeError, ValueError):
                    pass
    return {
        "platformMetrics": metrics,
        "totalFollowers": total,
        "forecast": forecast,
        "contentRecommendations": [str(x) for x in recs],
    }
