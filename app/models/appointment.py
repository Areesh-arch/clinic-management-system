from __future__ import annotations
from typing import TYPE_CHECKING
from datetime import date, time
from app.models.visit import Visit

from sqlalchemy import (
    ForeignKey,
    Date,
    Time,
    Enum,
    Text,
    Integer,
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
from app.models.enums import AppointmentStatus

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.patient import Patient
    from app.models.staff import Staff
    from app.models.visit import Visit

class Appointment(Base, IDMixin, TimestampMixin):

    __tablename__ = "appointments"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("staff.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    appointment_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    appointment_time: Mapped[time] = mapped_column(
        Time,
        nullable=False,
    )

    duration_minutes: Mapped[int] = mapped_column(
        Integer,
        default=30,
    )

    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(
            AppointmentStatus,
            native_enum=False,
        ),
        default=AppointmentStatus.SCHEDULED,
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="appointments",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="appointments",
    )

    doctor: Mapped["Staff"] = relationship(
        "Staff",
        back_populates="appointments",
    )
    
    visit: Mapped["Visit"] = relationship(
    "Visit",
    back_populates="appointment",
    uselist=False,
    cascade="all, delete-orphan",
    )
    
