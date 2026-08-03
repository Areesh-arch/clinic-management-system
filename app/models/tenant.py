from __future__ import annotations
from typing import TYPE_CHECKING
from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import TenantStatus
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.subscription import Subscription
    from app.models.user import User
    from app.models.patient import Patient

class Tenant(Base, IDMixin, TimestampMixin):
    """
    Represents a dermatology clinic (tenant) in the SaaS platform.
    """

    __tablename__ = "tenants"

    business_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    subdomain: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    status: Mapped[TenantStatus] = mapped_column(
        Enum(TenantStatus),
        default=TenantStatus.ACTIVE,
        nullable=False,
    )

        # Relationships
    users: Mapped[list["User"]] = relationship(
        "User",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    subscriptions: Mapped[list["Subscription"]] = relationship(
        "Subscription",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    patients: Mapped[list["Patient"]] = relationship(
        "Patient",
        back_populates="tenant",
        cascade="all, delete-orphan",
        lazy="selectin",
    )