from datetime import datetime

from sqlalchemy import DateTime, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Appointment(Base, TimestampMixin):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
    )

    appointment_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="scheduled",
    )

    notes: Mapped[str] = mapped_column(
        String(500),
        nullable=True,
    )