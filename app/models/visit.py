from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base
from app.models.mixins import TimestampMixin


class Visit(Base, TimestampMixin):
    __tablename__ = "visits"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
    )

    patient_id: Mapped[int] = mapped_column(
        ForeignKey("patients.id"),
        nullable=False,
    )

    appointment_id: Mapped[int] = mapped_column(
        ForeignKey("appointments.id"),
        nullable=False,
    )

    visit_date: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
    )

    diagnosis: Mapped[str] = mapped_column(
        String(1000),
        nullable=True,
    )