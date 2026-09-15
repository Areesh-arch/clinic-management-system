from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.enums import SubscriptionPlan


class SubscriptionPlanConfigUpdate(BaseModel):
    display_name: str = Field(
        min_length=1,
        max_length=100,
    )

    price: Decimal = Field(
        ge=0,
    )

    currency: str = Field(
        min_length=1,
        max_length=10,
    )

    billing_interval: str = Field(
        min_length=1,
        max_length=30,
    )

    description: str = Field(
        default="",
        max_length=500,
    )

    features: list[str] = Field(
        default_factory=list,
    )

    is_active: bool = True


class SubscriptionPlanConfigResponse(BaseModel):
    id: int
    plan: SubscriptionPlan
    display_name: str
    price: Decimal
    currency: str
    billing_interval: str
    description: str
    features: list[str]
    is_active: bool

    class Config:
        from_attributes = True