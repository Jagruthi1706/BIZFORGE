from fastapi import APIRouter, HTTPException

from models.schemas import CompetitorScanRequest
from services.competitor_service import analyze_competitor_service

router = APIRouter()


@router.post("/scan")
async def competitor_scan(req: CompetitorScanRequest):
    try:
        return analyze_competitor_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
