from fastapi import APIRouter, HTTPException

from models.schemas import ContentGenerateRequest
from services.content_service import generate_content_service

router = APIRouter()


@router.post("/generate")
async def content_generate(req: ContentGenerateRequest):
    try:
        return generate_content_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
