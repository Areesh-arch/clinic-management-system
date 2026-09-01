from __future__ import annotations

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.mixins import TimestampMixin


class SiteSettings(Base, TimestampMixin):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    # =====================================================
    # HOMEPAGE
    # =====================================================

    homepage_eyebrow: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    homepage_title: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    homepage_description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    homepage_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    # =====================================================
    # CONTACT INFORMATION
    # =====================================================

    clinic_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    phone: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    email: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    address: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    whatsapp: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    opening_hours: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    map_url: Mapped[str | None] = mapped_column(
        String(1000),
        nullable=True,
    )