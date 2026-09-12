from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# =========================================================
# CREATE LEAD
# =========================================================

class LeadCreate(BaseModel):
    full_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    phone: str = Field(
        ...,
        min_length=1,
        max_length=30,
    )

    email: EmailStr | None = None

    message: str | None = Field(
        default=None,
        max_length=2000,
    )

    source: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    status: str = Field(
        default="new",
        max_length=50,
    )


# =========================================================
# UPDATE LEAD
# =========================================================

class LeadUpdate(BaseModel):
    full_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    phone: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )

    email: EmailStr | None = None

    message: str | None = Field(
        default=None,
        max_length=2000,
    )

    source: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    status: str | None = Field(
        default=None,
        max_length=50,
    )


# =========================================================
# RESPONSE
# =========================================================

class LeadResponse(BaseModel):
    id: int
    tenant_id: int

    full_name: str
    phone: str

    email: EmailStr | None = None
    message: str | None = None

    source: str
    status: str

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


# =========================================================
# CRM STATISTICS
# =========================================================

class LeadStatsResponse(BaseModel):
    total: int
    new: int
    contacted: int
    converted: int
    lost: int