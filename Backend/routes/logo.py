from fastapi import APIRouter, HTTPException

from models.schemas import LogoGenerateRequest, LogoGenerateResponse
from services.ai.pipeline import generate_logo

router = APIRouter()


@router.post("/generate", response_model=LogoGenerateResponse)
async def logo_generate(req: LogoGenerateRequest):
    try:
        return await generate_logo(req)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Logo generation failed.",
        ) from e
