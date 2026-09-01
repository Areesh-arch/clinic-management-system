from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CMSQuizCreate(BaseModel):
    question: str = Field(
        ...,
        min_length=5,
    )

    option_a: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    option_b: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    option_c: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    option_d: str = Field(
        ...,
        min_length=1,
        max_length=500,
    )

    correct_option: str = Field(
        ...,
        min_length=1,
        max_length=1,
    )

    explanation: str | None = None

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True

    @field_validator("correct_option")
    @classmethod
    def validate_correct_option(cls, value: str) -> str:
        value = value.upper()

        if value not in {"A", "B", "C", "D"}:
            raise ValueError(
                "correct_option must be A, B, C, or D"
            )

        return value


class CMSQuizUpdate(BaseModel):
    question: str | None = Field(
        default=None,
        min_length=5,
    )

    option_a: str | None = Field(
        default=None,
        max_length=500,
    )

    option_b: str | None = Field(
        default=None,
        max_length=500,
    )

    option_c: str | None = Field(
        default=None,
        max_length=500,
    )

    option_d: str | None = Field(
        default=None,
        max_length=500,
    )

    correct_option: str | None = Field(
        default=None,
        min_length=1,
        max_length=1,
    )

    explanation: str | None = None

    display_order: int | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None

    @field_validator("correct_option")
    @classmethod
    def validate_correct_option(cls, value: str | None) -> str | None:
        if value is None:
            return None

        value = value.upper()

        if value not in {"A", "B", "C", "D"}:
            raise ValueError(
                "correct_option must be A, B, C, or D"
            )

        return value


class CMSQuizResponse(BaseModel):
    id: int
    tenant_id: int

    question: str

    option_a: str
    option_b: str
    option_c: str
    option_d: str

    correct_option: str
    explanation: str | None

    display_order: int
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )