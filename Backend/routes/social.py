from fastapi import APIRouter, HTTPException

from models.schemas import SocialPlanRequest
from services.social_service import generate_social_plan_service

router = APIRouter()


@router.post("/plan")
async def social_plan(req: SocialPlanRequest):
    try:
        return generate_social_plan_service(req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
