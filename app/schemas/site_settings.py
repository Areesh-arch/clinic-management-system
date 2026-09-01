from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SiteSettingsCreate(BaseModel):

    homepage_eyebrow: str | None = Field(
        default=None,
        max_length=255,
    )

    homepage_title: str | None = Field(
        default=None,
        max_length=500,
    )

    homepage_description: str | None = None

    homepage_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    clinic_name: str | None = Field(
        default=None,
        max_length=255,
    )

    phone: str | None = Field(
        default=None,
        max_length=50,
    )

    email: EmailStr | None = None

    address: str | None = None

    whatsapp: str | None = Field(
        default=None,
        max_length=50,
    )

    opening_hours: str | None = None

    map_url: str | None = Field(
        default=None,
        max_length=1000,
    )


class SiteSettingsUpdate(BaseModel):

    homepage_eyebrow: str | None = Field(
        default=None,
        max_length=255,
    )

    homepage_title: str | None = Field(
        default=None,
        max_length=500,
    )

    homepage_description: str | None = None

    homepage_image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    clinic_name: str | None = Field(
        default=None,
        max_length=255,
    )

    phone: str | None = Field(
        default=None,
        max_length=50,
    )

    email: EmailStr | None = None

    address: str | None = None

    whatsapp: str | None = Field(
        default=None,
        max_length=50,
    )

    opening_hours: str | None = None

    map_url: str | None = Field(
        default=None,
        max_length=1000,
    )


class SiteSettingsResponse(BaseModel):
    id: int
    tenant_id: int

    homepage_eyebrow: str | None
    homepage_title: str | None
    homepage_description: str | None
    homepage_image_url: str | None

    clinic_name: str | None
    phone: str | None
    email: str | None
    address: str | None
    whatsapp: str | None
    opening_hours: str | None
    map_url: str | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )