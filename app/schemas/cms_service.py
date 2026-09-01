from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# CREATE CMS SERVICE
# =========================================================

class CMSServiceCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    short_description: str | None = Field(
        default=None,
        max_length=500,
    )

    description: str | None = None

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


# =========================================================
# UPDATE CMS SERVICE
# =========================================================

class CMSServiceUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    slug: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    short_description: str | None = Field(
        default=None,
        max_length=500,
    )

    description: str | None = None

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    display_order: int | None = Field(
        default=None,
        ge=0,
    )

    is_active: bool | None = None


# =========================================================
# RESPONSE
# =========================================================

class CMSServiceResponse(BaseModel):
    id: int
    tenant_id: int

    name: str
    slug: str

    short_description: str | None
    description: str | None

    image_url: str | None

    display_order: int
    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )