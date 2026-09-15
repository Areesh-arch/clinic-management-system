from __future__ import annotations

from decimal import Decimal
from typing import Any

from sqlalchemy import Enum, JSON, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.enums import SubscriptionPlan
from app.models.mixins import IDMixin, TimestampMixin


class SubscriptionPlanConfig(
    Base,
    IDMixin,
    TimestampMixin,
):
    """
    Global configuration for subscription plans.

    This table stores the display information and pricing
    for BASIC, STANDARD and PREMIUM plans.

    Individual clinic subscriptions continue to store only
    which plan they are subscribed to.
    """

    __tablename__ = "subscription_plan_configs"

    plan: Mapped[SubscriptionPlan] = mapped_column(
        Enum(
            SubscriptionPlan,
            native_enum=False,
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    display_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=Decimal("0.00"),
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    features: Mapped[list[Any]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )