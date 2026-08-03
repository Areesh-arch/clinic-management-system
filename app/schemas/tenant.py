from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, EmailStr

from app.models.enums import TenantStatus


class TenantBase(BaseModel):
    """
    Common fields shared by all Tenant schemas.
    """

    business_name: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    subdomain: str = Field(
        ...,
        min_length=3,
        max_length=100,
    )


class TenantCreate(BaseModel):
    """
    Data required to register a new clinic.
    """

    business_name: str
    subdomain: str

    owner_name: str
    owner_email: EmailStr
    owner_password: str


class TenantUpdate(BaseModel):
    """
    Schema used when updating a tenant.
    """

    business_name: str | None = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    subdomain: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    status: TenantStatus | None = None


class TenantResponse(TenantBase):
    """
    Schema returned by the API.
    """

    id: int
    status: TenantStatus

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )