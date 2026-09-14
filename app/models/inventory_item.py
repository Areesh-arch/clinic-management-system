from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    String,
    Integer,
    Numeric,
    Date,
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
    from app.models.prescription_item import PrescriptionItem


class InventoryItem(Base, IDMixin, TimestampMixin):
    __tablename__ = "inventory_items"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    brand: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    # -----------------------------------------------------
    # STOCK / SALE UNITS
    # -----------------------------------------------------

    # Unit in which stock is purchased/stored.
    # Example: Box
    unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    # Unit in which medicine is issued/sold.
    # Example: Pack
    issue_unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="unit",
    )

    # How many issue units are inside one stock unit.
    #
    # Example:
    # 1 Box = 10 Packs
    #
    # For medicines already sold individually:
    # 1 Tablet = 1 Tablet
    units_per_stock_unit: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    # -----------------------------------------------------
    # STOCK
    # -----------------------------------------------------

    # Number of complete stock units.
    #
    # Example:
    # 5 Boxes
    #
    # This preserves the meaning of the existing quantity
    # column, so old inventory data remains safe.
    quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Remaining loose issue units.
    #
    # Example:
    # 4 Boxes + 9 Packs
    #
    # quantity = 4
    # loose_quantity = 9
    loose_quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    minimum_stock: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    # Prices are prices for ONE complete stock unit.
    #
    # Example:
    # Box purchase price = Rs.500
    # Box selling price  = Rs.700
    purchase_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    selling_price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    expiry_date: Mapped[date | None] = mapped_column(
        Date,
        nullable=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="inventory_items",
    )

    prescription_items: Mapped[list["PrescriptionItem"]] = relationship(
        "PrescriptionItem",
        back_populates="inventory_item",
    )