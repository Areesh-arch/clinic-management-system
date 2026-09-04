from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CMSTestimonialCreate(BaseModel):
    patient_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    feedback: str = Field(
        ...,
        min_length=5,
    )

    rating: int = Field(
        default=5,
        ge=1,
        le=5,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True

    @field_validator("patient_name")
    @classmethod
    def validate_patient_name(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("patient_name cannot be empty")

        return value

    @field_validator("feedback")
    @classmethod
    def validate_feedback(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("feedback cannot be empty")

        return value


class CMSTestimonialUpdate(BaseModel):
    patient_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    feedback: str | None = Field(
        default=None,
        min_length=5,
    )

    rating: int | None = Field(
        default=None,
        ge=1,
        le=5,
    )

    display_order: int | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None

    @field_validator("patient_name")
    @classmethod
    def validate_patient_name(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("patient_name cannot be empty")

        return value

    @field_validator("feedback")
    @classmethod
    def validate_feedback(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.strip()

        if not value:
            raise ValueError("feedback cannot be empty")

        return value


class CMSTestimonialResponse(BaseModel):
    id: int
    tenant_id: int
    patient_name: str
    feedback: str
    rating: int
    display_order: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)