# services/social_service.py

from __future__ import annotations

from services.groq_service import groq_generate
from utils.llm_json import parse_json_from_llm


def generate_social_plan_service(data: dict) -> dict:
    brand = data.get("brandName") or ""
    industry = data.get("industry") or ""
    goal = data.get("goal") or ""
    platforms = data.get("platforms") or []
    frequency = data.get("frequency") or "Weekly"

    prompt = f"""
Create a concise social media content plan.

Brand: {brand}
Industry: {industry}
Goal: {goal}
Platforms: {platforms}
Posting frequency hint: {frequency}

Return ONLY valid JSON (no markdown):
{{
  "calendar":[
    {{"day":1,"title":"","type":""}}
  ],
  "posts":[
    {{"platform":"","content":"","hashtags":[]}}
  ]
}}

calendar: 5–7 items with day 1-7. posts: 3–5 items with realistic captions and 3-6 hashtags each (hashtags as strings).
"""

    raw = groq_generate(prompt)
    parsed = parse_json_from_llm(raw)
    cal_raw = parsed.get("calendar")
    posts_raw = parsed.get("posts")

    calendar: list[dict] = []
    if isinstance(cal_raw, list):
        for item in cal_raw:
            if not isinstance(item, dict):
                continue
            try:
                day = int(item.get("day", 0))
            except (TypeError, ValueError):
                day = 0
            calendar.append(
                {
                    "day": day,
                    "title": str(item.get("title", "")),
                    "type": str(item.get("type", "")),
                }
            )

    posts: list[dict] = []
    if isinstance(posts_raw, list):
        for p in posts_raw:
            if not isinstance(p, dict):
                continue
            tags = p.get("hashtags")
            if isinstance(tags, list):
                norm_tags = [str(t) for t in tags]
            else:
                norm_tags = []
            posts.append(
                {
                    "platform": str(p.get("platform", "")),
                    "content": str(p.get("content", "")),
                    "hashtags": norm_tags,
                }
            )

    return {"calendar": calendar, "posts": posts}
