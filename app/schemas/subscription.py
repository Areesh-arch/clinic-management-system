from datetime import datetime

from pydantic import BaseModel

from app.models.enums import (
    SubscriptionPlan,
    SubscriptionStatus,
)


class SubscriptionCreate(BaseModel):
    tenant_id: int
    plan: SubscriptionPlan
    starts_at: datetime
    ends_at: datetime | None = None
    trial_ends_at: datetime


class SubscriptionUpdate(BaseModel):
    plan: SubscriptionPlan | None = None
    status: SubscriptionStatus | None = None
    starts_at: datetime | None = None
    ends_at: datetime | None = None
    trial_ends_at: datetime | None = None


class SubscriptionResponse(BaseModel):
    id: int
    tenant_id: int
    plan: SubscriptionPlan
    status: SubscriptionStatus
    starts_at: datetime
    ends_at: datetime | None
    trial_ends_at: datetime

    class Config:
        from_attributes = True