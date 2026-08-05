from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import date
from decimal import Decimal

from sqlalchemy import (
    ForeignKey,
    String,
    Date,
    Numeric,
    Boolean,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.models.base import Base
from app.models.mixins import (
    IDMixin,
    TimestampMixin,
)

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.user import User


class Staff(Base, IDMixin, TimestampMixin):
    """
    Staff member working in a clinic.
    Authentication information is stored in User.
    HR information is stored here.
    """

    __tablename__ = "staff"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "tenants.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
    )

    employee_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    designation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    salary: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=True,
    )

    hire_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="staff",
        lazy="selectin",
    )

    user: Mapped["User"] = relationship(
        "User",
        lazy="selectin",
    )