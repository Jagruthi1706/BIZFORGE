"""Async image generation via Replicate SDXL with logo-tuned parameters."""

from __future__ import annotations

import asyncio
import os

import replicate
from dotenv import load_dotenv

load_dotenv()

_client: replicate.Client | None = None

DEFAULT_MODEL = os.getenv("REPLICATE_LOGO_MODEL", "stability-ai/sdxl")
GUIDANCE_SCALE = float(os.getenv("SDXL_GUIDANCE_SCALE", "8.0"))
INFERENCE_STEPS = int(os.getenv("SDXL_INFERENCE_STEPS", "35"))


def _get_client() -> replicate.Client | None:
    global _client
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token:
        return None
    if _client is None:
        _client = replicate.Client(api_token=token)
    return _client


def _run_sdxl_sync(
    prompt: str,
    negative_prompt: str,
    *,
    seed: int | None = None,
) -> str:
    client = _get_client()
    if client is None:
        raise ValueError(
            "REPLICATE_API_TOKEN is not set. Add it to Backend/.env for logo generation."
        )

    payload: dict = {
        "prompt": prompt,
        "negative_prompt": negative_prompt,
        "width": 1024,
        "height": 1024,
        "num_outputs": 1,
        "guidance_scale": GUIDANCE_SCALE,
        "num_inference_steps": INFERENCE_STEPS,
    }
    if seed is not None:
        payload["seed"] = seed

    output = client.run(DEFAULT_MODEL, input=payload)
    if isinstance(output, list) and output:
        return str(output[0])
    return str(output)


async def generate_logo_image(
    prompt: str,
    negative_prompt: str,
    *,
    seed: int | None = None,
) -> str:
    return await asyncio.to_thread(
        _run_sdxl_sync, prompt, negative_prompt, seed=seed
    )


def replicate_configured() -> bool:
    return bool(os.getenv("REPLICATE_API_TOKEN"))
