"""Shared Pydantic request/response models (camelCase matches frontend)."""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from models.sanitization import sanitize_text


def _clean_optional(v: str | None) -> str | None:
    if v is None:
        return None
    return sanitize_text(v) or None


def _clean_required(v: str) -> str:
    out = sanitize_text(v)
    if not out:
        raise ValueError("Field cannot be empty.")
    return out


class LogoGenerateRequest(BaseModel):
    brandName: str = Field(..., min_length=1, max_length=120)
    industry: str = Field(..., min_length=1, max_length=120)
    keywords: str = Field(default="", max_length=500)
    tone: str = Field(default="Professional", max_length=80)
    targetAudience: str | None = Field(default=None, max_length=200)

    @field_validator("brandName", "industry", mode="before")
    @classmethod
    def clean_required(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("keywords", "tone", mode="before")
    @classmethod
    def clean_str_fields(cls, v: object) -> str:
        if v is None:
            return ""
        return sanitize_text(str(v))

    @field_validator("targetAudience", mode="before")
    @classmethod
    def clean_audience(cls, v: object) -> str | None:
        if v is None:
            return None
        s = sanitize_text(str(v))
        return s or None


class LogoGenerateResponse(BaseModel):
    imageUrl: str
    prompt: str


class BrandGenerateRequest(BaseModel):
    industry: str = Field(..., min_length=1, max_length=200)
    keywords: str = Field(default="", max_length=2000)
    tone: str = Field(default="Professional", max_length=100)
    language: str = Field(default="en", max_length=32)
    generateNames: bool = True
    generateTaglines: bool = True
    generateSlogans: bool = True

    @field_validator("industry", mode="before")
    @classmethod
    def clean_industry(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("keywords", "tone", "language", mode="before")
    @classmethod
    def clean_optional(cls, v: object) -> str:
        return sanitize_text(str(v)) if v is not None else ""


class ContentGenerateRequest(BaseModel):
    brandDesc: str = Field(..., min_length=1, max_length=8000)
    contentType: str = Field(..., min_length=1, max_length=64)
    tone: str = Field(default="Professional", max_length=100)

    @field_validator("brandDesc", "contentType", mode="before")
    @classmethod
    def clean_required_fields(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("tone", mode="before")
    @classmethod
    def clean_tone(cls, v: object) -> str:
        return sanitize_text(str(v)) or "Professional"


class DesignGenerateRequest(BaseModel):
    tone: str = Field(..., min_length=1, max_length=100)
    industry: str = Field(..., min_length=1, max_length=200)

    @field_validator("tone", "industry", mode="before")
    @classmethod
    def clean_fields(cls, v: object) -> str:
        return _clean_required(str(v))


class SentimentAnalyzeRequest(BaseModel):
    reviewText: str | None = Field(default=None, max_length=16000)
    text: str | None = Field(default=None, max_length=16000)

    @field_validator("reviewText", "text", mode="before")
    @classmethod
    def clean_body(cls, v: object) -> str | None:
        return _clean_optional(str(v) if v is not None else None)


class ChatMessageRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)

    @field_validator("message", mode="before")
    @classmethod
    def clean_message(cls, v: object) -> str:
        return _clean_required(str(v))


class TrendPredictRequest(BaseModel):
    industry: str = Field(..., min_length=1, max_length=200)
    targetAudience: str = Field(default="", max_length=500)

    @field_validator("industry", mode="before")
    @classmethod
    def clean_industry(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("targetAudience", mode="before")
    @classmethod
    def clean_audience(cls, v: object) -> str:
        return sanitize_text(str(v)) if v is not None else ""


class RepurposeGenerateRequest(BaseModel):
    marketingText: str | None = Field(default=None, max_length=16000)
    content: str | None = Field(default=None, max_length=16000)

    @field_validator("marketingText", "content", mode="before")
    @classmethod
    def clean_body(cls, v: object) -> str | None:
        return _clean_optional(str(v) if v is not None else None)


class CompetitorScanRequest(BaseModel):
    competitorName: str = Field(..., min_length=1, max_length=200)
    link: str = Field(default="", max_length=2000)

    @field_validator("competitorName", mode="before")
    @classmethod
    def clean_name(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("link", mode="before")
    @classmethod
    def clean_link(cls, v: object) -> str:
        return sanitize_text(str(v)) if v is not None else ""


class GrowthAnalyzeRequest(BaseModel):
    instagramUrl: str | None = Field(default=None, max_length=2000)
    linkedinUrl: str | None = Field(default=None, max_length=2000)
    twitterUrl: str | None = Field(default=None, max_length=2000)
    facebookUrl: str | None = Field(default=None, max_length=2000)
    youtubeUrl: str | None = Field(default=None, max_length=2000)

    @field_validator(
        "instagramUrl",
        "linkedinUrl",
        "twitterUrl",
        "facebookUrl",
        "youtubeUrl",
        mode="before",
    )
    @classmethod
    def clean_urls(cls, v: object) -> str | None:
        return _clean_optional(str(v) if v is not None else None)


class SocialPlanRequest(BaseModel):
    brandName: str = Field(default="", max_length=200)
    industry: str = Field(..., min_length=1, max_length=200)
    goal: str = Field(default="", max_length=500)
    platforms: list[str] = Field(default_factory=list)
    frequency: str = Field(default="Weekly", max_length=64)

    @field_validator("industry", mode="before")
    @classmethod
    def clean_industry(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("brandName", "goal", "frequency", mode="before")
    @classmethod
    def clean_optional_str(cls, v: object) -> str:
        return sanitize_text(str(v)) if v is not None else ""

    @field_validator("platforms", mode="before")
    @classmethod
    def clean_platforms(cls, v: object) -> list[str]:
        if not v:
            return []
        items = v if isinstance(v, list) else [v]
        return [sanitize_text(str(p), max_len=64) for p in items if sanitize_text(str(p), max_len=64)]


class BrandSuiteGenerateRequest(BaseModel):
    industry: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=8000)
    tone: str = Field(default="Professional", max_length=100)
    keywords: str = Field(default="", max_length=500)
    includeNames: bool = True
    includeTaglines: bool = True
    includeLogos: bool = False
    includeStory: bool = True
    includeProductDesc: bool = False
    includeInvestorPitch: bool = False

    @field_validator("industry", "description", mode="before")
    @classmethod
    def clean_required_fields(cls, v: object) -> str:
        return _clean_required(str(v))

    @field_validator("tone", "keywords", mode="before")
    @classmethod
    def clean_optional_fields(cls, v: object) -> str:
        return sanitize_text(str(v)) if v is not None else ""
