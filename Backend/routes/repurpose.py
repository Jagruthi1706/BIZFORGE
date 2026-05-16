from fastapi import APIRouter, HTTPException

from models.schemas import RepurposeGenerateRequest
from services.repurpose_service import repurpose_content_service

router = APIRouter()


@router.post("/generate")
async def repurpose_generate(req: RepurposeGenerateRequest):
    body = (req.marketingText or req.content or "").strip()
    if not body:
        raise HTTPException(status_code=422, detail="Provide marketingText or content.")
    try:
        return repurpose_content_service({"marketingText": body})
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
