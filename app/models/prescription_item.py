from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Text,
    Numeric,
)

from sqlalchemy.orm import relationship

from app.models.mixins import (
    IDMixin,
    TimestampMixin,
)

from app.models.base import Base


if TYPE_CHECKING:
    from app.models.prescription import Prescription
    from app.models.inventory_item import InventoryItem


class PrescriptionItem(
    Base,
    IDMixin,
    TimestampMixin,
):
    __tablename__ = "prescription_items"

    # =========================================================
    # PRESCRIPTION
    # =========================================================

    prescription_id = Column(
        Integer,
        ForeignKey(
            "prescriptions.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    # =========================================================
    # INVENTORY MEDICINE
    # =========================================================

    inventory_item_id = Column(
        Integer,
        ForeignKey(
            "inventory_items.id",
            ondelete="RESTRICT",
        ),
        nullable=True,
        index=True,
    )

    # =========================================================
    # MEDICINE SNAPSHOT
    # =========================================================

    medicine_name = Column(
        String(255),
        nullable=False,
    )

    # =========================================================
    # PRICING SNAPSHOT
    # =========================================================

    unit_price = Column(
        Numeric(10, 2),
        nullable=True,
    )

    total_amount = Column(
        Numeric(10, 2),
        nullable=True,
    )

    # =========================================================
    # DOSAGE INFORMATION
    # =========================================================

    dosage = Column(
        String(100),
        nullable=False,
    )

    frequency = Column(
        String(100),
        nullable=False,
    )

    duration = Column(
        String(100),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    # =========================================================
    # RELATIONSHIPS
    # =========================================================

    prescription = relationship(
        "Prescription",
        back_populates="items",
    )

    inventory_item = relationship(
        "InventoryItem",
        back_populates="prescription_items",
    )