from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class Lead(Base, TimestampMixin):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
    )

    phone: Mapped[str] = mapped_column(
        String(30),
    )

    source: Mapped[str] = mapped_column(
        String(100),
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="new",
    )