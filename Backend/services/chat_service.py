# services/chat_service.py

from services.groq_service import groq_generate


def chat_service(message: str):

    prompt = f"""
    You are a branding consultant AI.

    User message:
    {message}

    Give expert branding advice.
    """

    reply = groq_generate(prompt)

    return {"reply": reply}
