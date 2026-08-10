from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    Numeric,
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
    from app.models.patient import Patient
    from app.models.visit import Visit


class Outstanding(Base, IDMixin, TimestampMixin):
    __tablename__ = "outstandings"

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

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    total_charge: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    total_paid: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0,
    )

    outstanding_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
        default=0,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="outstandings",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="outstandings",
    )

    visit: Mapped["Visit"] = relationship(
        "Visit",
        back_populates="outstanding",
    )