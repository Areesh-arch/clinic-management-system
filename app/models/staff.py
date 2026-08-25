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
    from app.models.appointment import Appointment
    from app.models.visit import Visit


class Staff(Base, IDMixin, TimestampMixin):
    """
    Represents a staff member working in a clinic.

    Authentication and account information is stored in User.
    Staff-specific employment information is stored here.

    Examples of staff:
    - Receptionist
    - Nurse
    - Other clinic employees
    """

    __tablename__ = "staff"

    # ============================================================
    # TENANT
    # ============================================================

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "tenants.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    # ============================================================
    # USER
    # ============================================================

    user_id: Mapped[int] = mapped_column(
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        unique=True,
        nullable=False,
        index=True,
    )

    # ============================================================
    # EMPLOYEE INFORMATION
    # ============================================================

    employee_code: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    designation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    salary: Mapped[Decimal | None] = mapped_column(
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

    # ============================================================
    # RELATIONSHIPS
    # ============================================================

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="staff",
        lazy="selectin",
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="staff",
        lazy="selectin",
    )

    # ============================================================
    # EXISTING APPOINTMENT RELATIONSHIP
    #
    # NOTE:
    # Appointment currently uses:
    #
    #     doctor_id -> staff.id
    #
    # and:
    #
    #     Appointment.doctor
    #
    # Therefore this relationship name must remain "appointments"
    # for the current database architecture.
    # ============================================================

    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment",
        back_populates="doctor",
        cascade="all, delete-orphan",
    )

    # ============================================================
    # EXISTING VISIT RELATIONSHIP
    #
    # Visit currently uses:
    #
    #     doctor_id -> staff.id
    #
    # and:
    #
    #     Visit.doctor
    #
    # Therefore this relationship name must remain "visits"
    # for now.
    # ============================================================

    visits: Mapped[list["Visit"]] = relationship(
        "Visit",
        back_populates="doctor",
        cascade="all, delete-orphan",
    )