from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    String,
    Text,
)

from sqlalchemy.orm import relationship

from app.models.mixins import (
    IDMixin,
    TimestampMixin,
)

from app.models.base import Base


class PrescriptionItem(Base, IDMixin, TimestampMixin):
    __tablename__ = "prescription_items"

    prescription_id = Column(
        Integer,
        ForeignKey("prescriptions.id"),
        nullable=False,
    )

    medicine_name = Column(
        String(255),
        nullable=False,
    )

    dosage = Column(
        String(100),
        nullable=False,
    )

    frequency = Column(
        String(100),
        nullable=False,
    )

    duration = Column(
        String(100),
        nullable=False,
    )

    quantity = Column(
        Integer,
        nullable=False,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    prescription = relationship(
        "Prescription",
        back_populates="items",
    )