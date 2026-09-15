from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    Integer,
    Numeric,
    String,
    DateTime,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base
from app.models.mixins import IDMixin, TimestampMixin

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.inventory_item import InventoryItem
    from app.models.patient import Patient
    from app.models.visit import Visit
    from app.models.user import User


class MedicineIssue(Base, IDMixin, TimestampMixin):
    __tablename__ = "medicine_issues"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    inventory_item_id: Mapped[int] = mapped_column(
        ForeignKey("inventory_items.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Optional:
    # NULL means this medicine was issued to a non-patient/walk-in person.
    patient_id: Mapped[int | None] = mapped_column(
        ForeignKey("patients.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Optional:
    # Direct medicine issue does not need a visit.
    visit_id: Mapped[int | None] = mapped_column(
        ForeignKey("visits.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Used when medicine is issued to someone who is not registered as a patient.
    customer_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    medicine_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    medicine_unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    quantity: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    unit_price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    total_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
    )

    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
    )

    inventory_item: Mapped["InventoryItem"] = relationship(
        "InventoryItem",
    )

    patient: Mapped["Patient | None"] = relationship(
        "Patient",
    )

    visit: Mapped["Visit | None"] = relationship(
        "Visit",
    )

    created_by_user: Mapped["User | None"] = relationship(
        "User",
    )