from datetime import date

from sqlalchemy import Date, ForeignKey, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Inventory(Base, TimestampMixin):
    __tablename__ = "inventory"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
    )

    medicine_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    stock_quantity: Mapped[int] = mapped_column(
        Integer,
        default=0,
    )

    unit_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    expiry_date: Mapped[date] = mapped_column(
        Date,
        nullable=True,
    )

    last_updated: Mapped[date] = mapped_column(
        Date,
        nullable=True,
    )