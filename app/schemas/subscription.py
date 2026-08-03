from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import (
    SubscriptionPlan,
    SubscriptionStatus,
)


class SubscriptionBase(BaseModel):
    """
    Common fields shared by all subscription schemas.
    """

    plan: SubscriptionPlan
    status: SubscriptionStatus


class SubscriptionCreate(SubscriptionBase):
    """
    Used when creating a subscription.
    """

    tenant_id: int

    starts_at: datetime
    ends_at: datetime | None = None
    trial_ends_at: datetime


class SubscriptionUpdate(BaseModel):
    """
    Used when updating a subscription.
    """

    plan: SubscriptionPlan | None = None
    status: SubscriptionStatus | None = None
    ends_at: datetime | None = None


class SubscriptionResponse(SubscriptionBase):
    """
    Returned by the API.
    """

    id: int

    tenant_id: int

    starts_at: datetime
    ends_at: datetime | None
    trial_ends_at: datetime

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )