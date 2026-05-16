from fastapi import APIRouter, HTTPException

from models.schemas import BrandSuiteGenerateRequest
from services.suite_service import generate_brand_suite_service

router = APIRouter()


@router.post("/generate")
async def brand_suite(req: BrandSuiteGenerateRequest):
    try:
        return generate_brand_suite_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
