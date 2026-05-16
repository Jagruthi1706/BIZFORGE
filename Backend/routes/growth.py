from fastapi import APIRouter, HTTPException

from models.schemas import GrowthAnalyzeRequest
from services.growth_service import analyze_growth_service

router = APIRouter()


@router.post("/analyze")
async def growth_analyze(req: GrowthAnalyzeRequest):
    try:
        return analyze_growth_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
