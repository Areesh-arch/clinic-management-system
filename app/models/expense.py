from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Expense(Base, TimestampMixin):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
    )

    category: Mapped[str] = mapped_column(
        String(100),
    )

    amount: Mapped[float] = mapped_column(Float)

    description: Mapped[str] = mapped_column(
        String(500),
        nullable=True,
    )