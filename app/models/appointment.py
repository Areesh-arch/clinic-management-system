from __future__ import annotations

from datetime import date, time

from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
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

from app.models.enums import (
    AppointmentStatus,
    AppointmentSource,
)


if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.patient import Patient
    from app.models.visit import Visit


class Appointment(Base, IDMixin, TimestampMixin):
    __tablename__ = "appointments"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey(
            "tenants.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey(
            "patients.id",
            ondelete="CASCADE",
        ),
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
        nullable=False,
    )

    status: Mapped[AppointmentStatus] = mapped_column(
        Enum(
            AppointmentStatus,
            native_enum=False,
        ),
        default=AppointmentStatus.SCHEDULED,
        nullable=False,
    )

    source: Mapped[AppointmentSource] = mapped_column(
        Enum(
            AppointmentSource,
            native_enum=False,
            values_callable=lambda enum_class: [
                member.value for member in enum_class
            ],
        ),
        default=AppointmentSource.CLINIC,
        nullable=False,
    )

    reason: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    is_follow_up: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # =====================================================
    # ARCHIVE
    # =====================================================

    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        index=True,
    )

    # =====================================================
    # RELATIONSHIPS
    # =====================================================

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="appointments",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="appointments",
    )

    visit: Mapped["Visit"] = relationship(
        "Visit",
        back_populates="appointment",
        uselist=False,
        cascade="all, delete-orphan",
    )