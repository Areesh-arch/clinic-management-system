from __future__ import annotations

from sqlalchemy import Boolean, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base
from app.models.mixins import TimestampMixin


class CMSQuiz(Base, TimestampMixin):
    __tablename__ = "cms_quiz_questions"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )

    question: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    option_a: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    option_b: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    option_c: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    option_d: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    correct_option: Mapped[str] = mapped_column(
        String(1),
        nullable=False,
    )

    explanation: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    display_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )