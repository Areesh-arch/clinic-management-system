from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    Date,
    Enum,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.enums import (
    BloodGroup,
    Gender,
    MaritalStatus,
)
from app.models.mixins import (
    IDMixin,
    TenantMixin,
    TimestampMixin,
)

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.appointment import Appointment
    from app.models.visit import Visit
    from app.models.payment import Payment

class Patient(Base, IDMixin, TenantMixin, TimestampMixin):
    """
    Patient model.
    """

    __tablename__ = "patients"

    medical_record_number: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
        index=True,
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    gender: Mapped[Gender] = mapped_column(
        Enum(Gender, native_enum=False),
        nullable=False,
    )

    date_of_birth: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    phone: Mapped[str | None] = mapped_column(
        String(20),
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
    )

    address: Mapped[str | None] = mapped_column(
        String(255),
    )

    city: Mapped[str | None] = mapped_column(
        String(100),
    )

    country: Mapped[str | None] = mapped_column(
        String(100),
    )

    cnic: Mapped[str | None] = mapped_column(
        String(20),
        unique=True,
    )

    occupation: Mapped[str | None] = mapped_column(
        String(100),
    )

    marital_status: Mapped[MaritalStatus | None] = mapped_column(
        Enum(MaritalStatus, native_enum=False),
    )

    blood_group: Mapped[BloodGroup | None] = mapped_column(
        Enum(BloodGroup, native_enum=False),
    )

    allergies: Mapped[str | None] = mapped_column(
        Text,
    )

    medical_history: Mapped[str | None] = mapped_column(
        Text,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
    )

    emergency_contact_name: Mapped[str | None] = mapped_column(
        String(100),
    )

    emergency_contact_phone: Mapped[str | None] = mapped_column(
        String(20),
    )

    profile_photo: Mapped[str | None] = mapped_column(
        String(500),
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="patients",
    )
    
    appointments: Mapped[list["Appointment"]] = relationship(
        "Appointment",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    visits: Mapped[list["Visit"]] = relationship(
        "Visit",
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    
    payments: Mapped[list["Payment"]] = relationship(
        "Payment",
        back_populates="patient",
        cascade="all, delete-orphan",
    )