from fastapi import APIRouter, HTTPException

from models.schemas import TrendPredictRequest
from services.trends_service import predict_trends_service

router = APIRouter()


@router.post("/predict")
async def trends_predict(req: TrendPredictRequest):
    try:
        return predict_trends_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
