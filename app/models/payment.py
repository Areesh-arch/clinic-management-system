from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    Numeric,
    Date,
    Text,
    Enum,
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

from app.models.enums import PaymentMethod

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.patient import Patient
    from app.models.visit import Visit


class Payment(Base, IDMixin, TimestampMixin):

    __tablename__ = "payments"

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
        index=True,
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    payment_method: Mapped[PaymentMethod] = mapped_column(
        Enum(
            PaymentMethod,
            native_enum=False,
        ),
        nullable=False,
    )

    payment_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ============================================================
    # ARCHIVE / SOFT DELETE
    # ============================================================

    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        index=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="payments",
    )

    patient: Mapped["Patient"] = relationship(
        "Patient",
        back_populates="payments",
    )

    visit: Mapped["Visit"] = relationship(
        "Visit",
        back_populates="payments",
    )