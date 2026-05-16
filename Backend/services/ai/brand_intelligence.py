"""Rule-based brand metadata extraction before prompt construction."""

from __future__ import annotations

import re
from dataclasses import dataclass, field


@dataclass
class BrandMetadata:
    brand: str
    industry: str
    industry_slug: str
    tone: str
    audience: str
    personality: list[str] = field(default_factory=list)
    visual_style: str = "minimal vector branding"
    palette: list[str] = field(default_factory=list)
    iconography: str = "abstract geometric mark"


_INDUSTRY_ALIASES: dict[str, str] = {
    "ecommerce": "ecommerce",
    "e-commerce": "ecommerce",
    "retail": "ecommerce",
    "shop": "ecommerce",
    "fintech": "fintech",
    "finance": "fintech",
    "banking": "fintech",
    "payments": "fintech",
    "ai": "ai",
    "artificial intelligence": "ai",
    "machine learning": "ai",
    "ml": "ai",
    "saas": "saas",
    "software": "saas",
    "b2b": "saas",
    "tech": "saas",
    "startup": "saas",
    "fashion": "fashion",
    "apparel": "fashion",
    "luxury": "luxury",
    "premium": "luxury",
    "food": "food",
    "restaurant": "food",
    "cafe": "food",
    "creator": "creator",
    "influencer": "creator",
    "media": "creator",
    "health": "health",
    "wellness": "health",
    "fitness": "health",
    "education": "education",
    "edtech": "education",
}


_INDUSTRY_MODIFIERS: dict[str, dict[str, str]] = {
    "fintech": {
        "modifier": "monolithic geometric mark, deep navy and emerald, trust and stability",
        "iconography": "shield or pillar geometry, secure fintech symbol",
        "palette": ["#0B1120", "#10B981", "#F8FAFC"],
    },
    "ai": {
        "modifier": "neural nodes, abstract spark, deep purple and electric blue, futuristic minimal",
        "iconography": "neural network node or abstract intelligence spark",
        "palette": ["#7C3AED", "#4F46E5", "#0B1120"],
    },
    "saas": {
        "modifier": "modern SaaS wordmark, clean geometric icon, indigo and slate palette",
        "iconography": "layered product mark or abstract S-curve",
        "palette": ["#4F46E5", "#2563EB", "#0B1120", "#F8FAFC"],
    },
    "ecommerce": {
        "modifier": "friendly shopping motif, bold sans wordmark, vibrant conversion-focused accent",
        "iconography": "bag, cart, or marketplace badge simplified to icon",
        "palette": ["#7C3AED", "#F59E0B", "#111827"],
    },
    "fashion": {
        "modifier": "elegant fashion logotype, refined negative space, editorial aesthetic",
        "iconography": "minimal monogram or thread motif",
        "palette": ["#111827", "#F8FAFC", "#D4AF37"],
    },
    "luxury": {
        "modifier": "premium serif logotype, gold accent, high contrast luxury branding",
        "iconography": "crest or refined monogram",
        "palette": ["#0B1120", "#D4AF37", "#F8FAFC"],
    },
    "food": {
        "modifier": "organic rounded shapes, warm appetizing palette, approachable brand mark",
        "iconography": "leaf, bowl, or organic curve symbol",
        "palette": ["#EA580C", "#16A34A", "#FFFBEB"],
    },
    "creator": {
        "modifier": "playful creator badge, dynamic mark, social-native branding",
        "iconography": "play button, star, or creator badge",
        "palette": ["#EC4899", "#8B5CF6", "#0B1120"],
    },
    "health": {
        "modifier": "calm wellness branding, soft curves, trustworthy medical-adjacent palette",
        "iconography": "cross, leaf, or pulse line simplified",
        "palette": ["#0EA5E9", "#10B981", "#F0FDF4"],
    },
    "education": {
        "modifier": "approachable edtech branding, book or growth motif, clear readable mark",
        "iconography": "book, graduation cap abstract, or growth arrow",
        "palette": ["#2563EB", "#7C3AED", "#F8FAFC"],
    },
    "default": {
        "modifier": "modern startup wordmark, geometric icon, professional SaaS identity",
        "iconography": "abstract geometric startup symbol",
        "palette": ["#7C3AED", "#4F46E5", "#050816", "#F8FAFC"],
    },
}


_TONE_PERSONALITY: dict[str, list[str]] = {
    "professional": ["trustworthy", "credible", "polished"],
    "bold": ["confident", "energetic", "disruptive"],
    "playful": ["friendly", "approachable", "youthful"],
    "luxury": ["premium", "refined", "exclusive"],
    "minimal": ["clean", "precise", "modern"],
    "elegant": ["sophisticated", "balanced", "timeless"],
}


def _normalize_slug(industry: str) -> str:
    raw = industry.lower().strip()
    for alias, slug in _INDUSTRY_ALIASES.items():
        if alias in raw:
            return slug
    tokens = re.split(r"[\s,/\-]+", raw)
    for token in tokens:
        if token in _INDUSTRY_ALIASES:
            return _INDUSTRY_ALIASES[token]
    return "default"


def build_brand_metadata(
    brand_name: str,
    industry: str,
    keywords: str = "",
    tone: str = "Professional",
    target_audience: str | None = None,
) -> BrandMetadata:
    slug = _normalize_slug(industry)
    profile = _INDUSTRY_MODIFIERS.get(slug, _INDUSTRY_MODIFIERS["default"])
    tone_key = tone.lower().strip()
    personality = _TONE_PERSONALITY.get(tone_key, ["modern", "professional", "startup-ready"])

    audience = (target_audience or "").strip()
    if not audience:
        audience = {
            "ecommerce": "online shoppers and digital buyers",
            "fintech": "founders, operators, and finance professionals",
            "ai": "builders, developers, and AI-native teams",
            "saas": "B2B buyers and product-led growth teams",
            "fashion": "style-conscious consumers",
            "luxury": "affluent premium buyers",
            "food": "local diners and food enthusiasts",
            "creator": "creators and social audiences",
        }.get(slug, "startup founders and early adopters")

    visual_style = "minimal vector branding, flat iconography, typography-focused logo"
    if keywords:
        kw = keywords.lower()
        if "minimal" in kw or "clean" in kw:
            visual_style = "ultra-minimal vector logo, flat icon, generous whitespace"
        elif "bold" in kw or "vibrant" in kw:
            visual_style = "bold flat vector logo, strong contrast, memorable icon"

    return BrandMetadata(
        brand=brand_name.strip(),
        industry=industry.strip(),
        industry_slug=slug,
        tone=tone.strip() or "Professional",
        audience=audience,
        personality=personality,
        visual_style=visual_style,
        palette=list(profile["palette"]),
        iconography=profile["iconography"],
    )


def industry_modifier(meta: BrandMetadata) -> str:
    profile = _INDUSTRY_MODIFIERS.get(
        meta.industry_slug, _INDUSTRY_MODIFIERS["default"]
    )
    return profile["modifier"]
