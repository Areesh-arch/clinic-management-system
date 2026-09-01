from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.mixins import TimestampMixin


class CMSBlog(Base, TimestampMixin):
    __tablename__ = "cms_blogs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    slug: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    excerpt: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    content: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    featured_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    author_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )