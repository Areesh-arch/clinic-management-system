from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Tenant(Base, TimestampMixin):
    __tablename__ = "tenants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    clinic_name: Mapped[str] = mapped_column(String(150), nullable=False)

    owner_name: Mapped[str] = mapped_column(String(100), nullable=False)

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    phone: Mapped[str] = mapped_column(String(20))

    address: Mapped[str] = mapped_column(String(255))

    city: Mapped[str] = mapped_column(String(100))

    country: Mapped[str] = mapped_column(String(100))

    subscription_plan: Mapped[str] = mapped_column(
        String(20),
        default="basic"
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )