from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CMSResultCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    description: str | None = None

    before_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    after_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    treatment_name: str | None = Field(
        default=None,
        max_length=255,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class CMSResultUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    slug: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description: str | None = None

    before_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    after_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    treatment_name: str | None = Field(
        default=None,
        max_length=255,
    )

    display_order: int | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None


class CMSResultResponse(BaseModel):
    id: int
    tenant_id: int

    title: str
    slug: str
    description: str | None

    before_image_url: str | None
    after_image_url: str | None

    treatment_name: str | None

    display_order: int
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )