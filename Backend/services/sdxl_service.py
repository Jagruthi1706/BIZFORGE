"""Backward-compatible SDXL entrypoint — prefer services.ai.generation."""

from __future__ import annotations

from services.ai.generation import generate_logo_image
from services.ai.prompt_engineering import GLOBAL_NEGATIVE

__all__ = ["generate_logo_sdxl", "GLOBAL_NEGATIVE"]


async def generate_logo_sdxl(prompt: str, negative_prompt: str | None = None) -> str:
    return await generate_logo_image(
        prompt, negative_prompt or GLOBAL_NEGATIVE
    )
