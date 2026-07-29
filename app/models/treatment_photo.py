from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base
from app.models.mixins import TimestampMixin


class TreatmentPhoto(Base, TimestampMixin):
    __tablename__ = "treatment_photos"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id"),
        nullable=False,
    )

    photo_type: Mapped[str] = mapped_column(
        String(20),
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
    )