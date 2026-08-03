from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import SubscriptionPlan, SubscriptionStatus
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant

class Subscription(Base, IDMixin, TimestampMixin):
    """
    Represents a clinic's subscription plan.
    """

    __tablename__ = "subscriptions"

    tenant_id: Mapped[int] = mapped_column(
    ForeignKey(
        "tenants.id",
        ondelete="CASCADE",
    ),
    nullable=False,
    index=True,
)

    plan: Mapped[SubscriptionPlan] = mapped_column(
    Enum(
        SubscriptionPlan,
        native_enum=False,
    ),
    default=SubscriptionPlan.BASIC,
    nullable=False,
)

    status: Mapped[SubscriptionStatus] = mapped_column(
    Enum(
        SubscriptionStatus,
        native_enum=False,
    ),
    default=SubscriptionStatus.TRIAL,
    nullable=False,
)

    starts_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    ends_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    trial_ends_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    # Relationship
    tenant: Mapped["Tenant"] = relationship(
    "Tenant",
    back_populates="subscriptions",
    lazy="selectin",
)