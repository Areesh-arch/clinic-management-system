from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Column, Integer, ForeignKey, String, Text, Numeric
from sqlalchemy.orm import relationship

from app.models.mixins import IDMixin, TimestampMixin
from app.models.base import Base


if TYPE_CHECKING:
    from app.models.prescription import Prescription
    from app.models.inventory_item import InventoryItem


class PrescriptionItem(Base, IDMixin, TimestampMixin):
    __tablename__ = "prescription_items"

    prescription_id = Column(
        Integer,
        ForeignKey("prescriptions.id", ondelete="CASCADE"),
        nullable=False,
    )

    inventory_item_id = Column(
        Integer,
        ForeignKey("inventory_items.id", ondelete="RESTRICT"),
        nullable=True,
        index=True,
    )

    medicine_name = Column(
        String(255),
        nullable=False,
    )

    # Snapshot of the inventory sale/issue unit at the time
    # the medicine was issued.
    #
    # Example:
    # Box -> Pack
    # Historical records will continue to show "Pack"
    # even if the inventory item is changed later.
    medicine_unit = Column(
        String(50),
        nullable=False,
        default="unit",
    )

    # Snapshot of how many issue units were contained
    # in one stock unit when this medicine was issued.
    #
    # Example:
    # 1 Box = 10 Packs
    # units_per_stock_unit = 10
    #
    # This is intentionally stored on the prescription item
    # so old records remain correct even if inventory conversion
    # is changed later.
    units_per_stock_unit = Column(
        Integer,
        nullable=False,
        default=1,
    )

    unit_price = Column(
        Numeric(10, 2),
        nullable=True,
    )

    total_amount = Column(
        Numeric(10, 2),
        nullable=True,
    )

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

    prescription = relationship(
        "Prescription",
        back_populates="items",
    )

    inventory_item = relationship(
        "InventoryItem",
        back_populates="prescription_items",
    )