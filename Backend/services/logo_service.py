# services/logo_service.py

from __future__ import annotations

from models.schemas import LogoGenerateRequest, LogoGenerateResponse
from services.ai.pipeline import generate_logo


async def generate_logo_service(
    brand_name: str,
    industry: str,
    style: str,
    colors: str = "",
    *,
    tone: str = "Professional",
    target_audience: str | None = None,
) -> LogoGenerateResponse:
    """Adapter used by routes — delegates to the AI pipeline."""
    req = LogoGenerateRequest(
        brandName=brand_name,
        industry=industry,
        keywords=style,
        tone=tone,
        targetAudience=target_audience,
    )
    return await generate_logo(req)
