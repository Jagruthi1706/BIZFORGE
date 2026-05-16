"""Logo generation orchestration: intelligence → prompts → SDXL → validation."""

from __future__ import annotations

import hashlib
import os

from models.schemas import LogoGenerateRequest, LogoGenerateResponse
from services.ai.brand_intelligence import build_brand_metadata
from services.ai.generation import generate_logo_image, replicate_configured
from services.ai.prompt_engineering import build_logo_prompts, build_retry_suffix
from services.ai.validation import validate_logo_url

MAX_LOGO_ATTEMPTS = int(os.getenv("MAX_LOGO_ATTEMPTS", "3"))


async def generate_logo(req: LogoGenerateRequest) -> LogoGenerateResponse:
    meta = build_brand_metadata(
        brand_name=req.brandName,
        industry=req.industry,
        keywords=req.keywords or "",
        tone=req.tone or "Professional",
        target_audience=req.targetAudience,
    )
    positive, negative = build_logo_prompts(meta, req.keywords or "")

    if not replicate_configured():
        raise ValueError(
            "REPLICATE_API_TOKEN is not set. Logo generation requires Replicate SDXL."
        )

    seed_base = int(
        hashlib.sha256(f"{req.brandName}:{req.industry}".encode()).hexdigest()[:8],
        16,
    )

    last_reason = "unknown"
    for attempt in range(1, MAX_LOGO_ATTEMPTS + 1):
        attempt_prompt = positive + build_retry_suffix(attempt)
        seed = seed_base + attempt
        try:
            url = await generate_logo_image(
                attempt_prompt, negative, seed=seed
            )
        except Exception as exc:
            last_reason = str(exc)
            continue

        ok, reason = validate_logo_url(url)
        if ok:
            return LogoGenerateResponse(imageUrl=url, prompt=attempt_prompt)
        last_reason = reason

    raise ValueError(
        f"Logo generation failed after {MAX_LOGO_ATTEMPTS} attempts ({last_reason})."
    )
