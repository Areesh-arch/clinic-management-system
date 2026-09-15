from __future__ import annotations

from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
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

    unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    issue_unit: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="unit",
    )

    units_per_stock_unit: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )

    # -----------------------------------------------------
    # STOCK
    # -----------------------------------------------------

    quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

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

    # -----------------------------------------------------
    # PRICES
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # ARCHIVE
    # -----------------------------------------------------

    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
        server_default="false",
        index=True,
    )

    # -----------------------------------------------------
    # RELATIONSHIPS
    # -----------------------------------------------------

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="inventory_items",
    )

    prescription_items: Mapped[list["PrescriptionItem"]] = relationship(
        "PrescriptionItem",
        back_populates="inventory_item",
    )