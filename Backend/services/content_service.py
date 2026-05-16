# services/content_service.py

from services.groq_service import groq_generate


def generate_content_service(data: dict):
    desc = data.get("brandDesc")
    content_type = data.get("contentType")
    tone = data.get("tone")

    prompt = f"""
    Create {content_type} content.

    Description: {desc}
    Tone: {tone}

    Return engaging marketing copy.
    """

    content = groq_generate(prompt)

    return {"content": content}
