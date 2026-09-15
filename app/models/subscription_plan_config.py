from __future__ import annotations

from sqlalchemy import Boolean, Enum, JSON, Numeric, String
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
    Global configuration for a subscription plan.

    One configuration exists for each subscription plan:
    BASIC, STANDARD, PREMIUM.
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

    price: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    currency: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
        default="PKR",
    )

    billing_interval: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="monthly",
    )

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        default="",
    )

    features: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )