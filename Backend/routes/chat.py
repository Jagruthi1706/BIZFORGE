from fastapi import APIRouter, HTTPException

from models.schemas import ChatMessageRequest
from services.chat_service import chat_service

router = APIRouter()


@router.post("/message")
async def chat(req: ChatMessageRequest):
    try:
        return chat_service(req.message)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
