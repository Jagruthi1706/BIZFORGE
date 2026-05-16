from fastapi import APIRouter, HTTPException

from models.schemas import BrandGenerateRequest
from services.brand_service import generate_brand_service

router = APIRouter()


@router.post("/generate")
async def brand_generate(req: BrandGenerateRequest):
    try:
        return generate_brand_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
