from fastapi import APIRouter, HTTPException

from models.schemas import SentimentAnalyzeRequest
from services.sentiment_service import analyze_sentiment_service

router = APIRouter()


@router.post("/analyze")
async def sentiment_analyze(req: SentimentAnalyzeRequest):
    body = (req.reviewText or req.text or "").strip()
    if not body:
        raise HTTPException(status_code=422, detail="Provide reviewText or text.")
    try:
        return analyze_sentiment_service({"reviewText": body})
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
