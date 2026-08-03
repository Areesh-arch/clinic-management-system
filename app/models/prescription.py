from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.session import Base
from app.models.mixins import TimestampMixin


class Prescription(Base, TimestampMixin):
    __tablename__ = "prescriptions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id"),
        nullable=False,
    )

    medicine: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    dosage: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    duration: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )