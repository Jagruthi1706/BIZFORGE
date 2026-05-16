from fastapi import APIRouter, HTTPException

from models.schemas import DesignGenerateRequest
from services.design_service import generate_design_service

router = APIRouter()


@router.post("/generate")
async def design_generate(req: DesignGenerateRequest):
    try:
        return generate_design_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
