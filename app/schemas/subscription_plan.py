from decimal import Decimal

from pydantic import BaseModel, Field

from app.models.enums import SubscriptionPlan


class SubscriptionPlanConfigResponse(BaseModel):
    plan: SubscriptionPlan
    display_name: str
    price: Decimal
    description: str
    features: list[str]

    class Config:
        from_attributes = True


class SubscriptionPlanConfigUpdate(BaseModel):
    display_name: str = Field(
        min_length=1,
        max_length=100,
    )

    price: Decimal = Field(
        ge=0,
        max_digits=12,
        decimal_places=2,
    )

    description: str = Field(
        min_length=1,
        max_length=500,
    )

    features: list[str] = Field(
        min_length=1,
    )