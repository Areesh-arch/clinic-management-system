from sqlalchemy import Float, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base
from app.models.mixins import TimestampMixin


class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id"),
        nullable=False,
    )

    amount: Mapped[float] = mapped_column(Float)

    payment_method: Mapped[str] = mapped_column(
        String(50),
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
    )