from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    """
    Adds created_at and updated_at timestamps.
    """

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class IDMixin:
    """
    Adds primary key.
    """

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )


class TenantMixin:
    """
    Adds tenant_id to tenant-owned models.
    """

    tenant_id: Mapped[int] = mapped_column(
        ForeignKey("tenants.id"),
        nullable=False,
        index=True,
    )