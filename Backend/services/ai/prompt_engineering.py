"""Structured logo prompt construction with keyword expansion and negative prompts."""

from __future__ import annotations

import re

from services.ai.brand_intelligence import BrandMetadata, industry_modifier

BASE_POSITIVE = (
    "Professional minimalist vector logo, flat design, typography-focused, "
    "clean edges, centered composition, solid background, modern tech aesthetic, "
    "startup branding, icon plus wordmark, SVG-style, no scenery, no photograph"
)

GLOBAL_NEGATIVE = (
    "landscape, scenery, mountains, bridge, nature, photography, realistic photo, "
    "cinematic, wallpaper, outdoor scene, environment, people, animals, travel photography, "
    "sunset, buildings, cityscape, 3d render, detailed illustration, random art, messy, "
    "blurry, low quality, watermark, mockup, poster, business card, website screenshot, "
    "multiple logos, collage, busy background, gradients overload, shadows, text artifacts"
)

KEYWORD_EXPANSIONS: dict[str, str] = {
    "minimal": "minimal vector startup branding, flat iconography, clean typography",
    "minimalistic": "minimal vector startup branding, flat iconography, clean typography",
    "aesthetic": "cohesive brand system, balanced proportions, premium startup look",
    "modern": "modern SaaS logo, geometric mark, crisp sans-serif wordmark",
    "tech": "technology startup logo, futuristic but flat vector style",
    "playful": "friendly rounded vector icon, approachable startup branding",
    "luxury": "premium refined logotype, elegant spacing, upscale brand mark",
    "bold": "bold high-contrast vector logo, strong silhouette, memorable icon",
    "elegant": "elegant refined vector logotype, sophisticated negative space",
    "vibrant": "vibrant flat color logo, energetic startup identity",
    "corporate": "corporate trustworthy vector logo, stable geometric mark",
    "startup": "early-stage startup logo, scalable brand mark for product UI",
    "vector": "vector logo design, flat shapes, crisp edges",
    "flat": "flat design logo, 2D vector shapes, no depth effects",
}


def expand_keywords(raw: str) -> str:
    if not raw or not raw.strip():
        return "modern SaaS vector logo, professional clean typography, flat iconography"
    text = raw.lower()
    parts: list[str] = []
    for key, expansion in KEYWORD_EXPANSIONS.items():
        if key in text:
            parts.append(expansion)
    if not parts:
        parts.append(
            f"{raw.strip()}, interpreted as professional startup vector branding, "
            "flat iconography, modern SaaS logo"
        )
    return ", ".join(dict.fromkeys(parts))


def build_logo_prompts(meta: BrandMetadata, keywords: str) -> tuple[str, str]:
    industry_frag = industry_modifier(meta)
    expanded = expand_keywords(keywords)
    palette = ", ".join(meta.palette)

    positive = (
        f"{BASE_POSITIVE}. "
        f'Brand name: "{meta.brand}" (legible, correctly spelled in design). '
        f"Industry context: {meta.industry}. {industry_frag}. "
        f"Tone: {meta.tone}. Target audience: {meta.audience}. "
        f"Brand personality: {', '.join(meta.personality)}. "
        f"Visual style: {meta.visual_style}. "
        f"Iconography direction: {meta.iconography}. "
        f"Color direction: {palette}. "
        f"Creative direction (expanded): {expanded}. "
        "Composition: single centered logo mark on square canvas, generous padding, "
        "no environment, no mockup frame, no UI screenshot, no extra objects."
    )
    positive = re.sub(r"\s+", " ", positive).strip()
    return positive, GLOBAL_NEGATIVE


def build_retry_suffix(attempt: int) -> str:
    return (
        f" Attempt {attempt}: enforce vector logo only, centered flat icon, "
        "absolutely no landscape or photography."
    )
