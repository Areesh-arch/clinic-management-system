from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    DateTime,
    Enum,
    Text,
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

from app.models.enums import VisitStatus

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.staff import Staff
    from app.models.appointment import Appointment
    from app.models.tenant import Tenant
    from app.models.prescription import Prescription
    from app.models.treatment_photo import TreatmentPhoto
    from app.models.payment import Payment

class Visit(Base, IDMixin, TimestampMixin):

    __tablename__ = "visits"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    appointment_id: Mapped[int] = mapped_column(
        ForeignKey("appointments.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
    )

    doctor_id: Mapped[int] = mapped_column(
        ForeignKey("staff.id", ondelete="CASCADE"),
        nullable=False,
    )

    visit_time: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    status: Mapped[VisitStatus] = mapped_column(
        Enum(
            VisitStatus,
            native_enum=False,
        ),
        default=VisitStatus.IN_PROGRESS,
    )

    chief_complaint: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    diagnosis: Mapped[str | None] = mapped_column(
    Text,
    nullable=True,
)

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="visits",
    )

    appointment: Mapped["Appointment"] = relationship(
        "Appointment",
        back_populates="visit",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="visits",
    )

    doctor: Mapped["Staff"] = relationship(
        "Staff",
        back_populates="visits",
    )
    
    prescription: Mapped["Prescription"] = relationship(
    "Prescription",
    back_populates="visit",
    uselist=False,
)
    
    photos: Mapped[list["TreatmentPhoto"]] = relationship(
    "TreatmentPhoto",
    back_populates="visit",
    cascade="all, delete-orphan",
)
    
    payments: Mapped[list["Payment"]] = relationship(
    "Payment",
    back_populates="visit",
    cascade="all, delete-orphan",
)