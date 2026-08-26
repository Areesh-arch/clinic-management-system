from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import (
    ForeignKey,
    String,
    Text,
    Enum,
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

from app.models.enums import PhotoType

if TYPE_CHECKING:
    from app.models.tenant import Tenant
    from app.models.visit import Visit


class TreatmentPhoto(Base, IDMixin, TimestampMixin):

    __tablename__ = "treatment_photos"

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    visit_id: Mapped[int] = mapped_column(
        ForeignKey("visits.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    photo_type: Mapped[PhotoType] = mapped_column(
        Enum(
            PhotoType,
            native_enum=False,
            values_callable=lambda enum_cls: [
                member.value for member in enum_cls
            ],
        ),
        nullable=False,
    )

    image_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    caption: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    tenant: Mapped["Tenant"] = relationship(
        "Tenant",
        back_populates="photos",
    )

    visit: Mapped["Visit"] = relationship(
        "Visit",
        back_populates="photos",
    )