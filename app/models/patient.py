from datetime import date

from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Patient(Base, TimestampMixin):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    gender: Mapped[str] = mapped_column(
        String(20)
    )

    date_of_birth: Mapped[date] = mapped_column(
        Date
    )

    phone: Mapped[str] = mapped_column(
        String(20)
    )

    email: Mapped[str] = mapped_column(
        String(255)
    )

    address: Mapped[str] = mapped_column(
        String(255)
    )