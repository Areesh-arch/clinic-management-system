"""remove doctor_id from appointments and visits

Revision ID: fdcb7bdb3cb1
Revises: 3ca3382e6560
Create Date: 2026-08-27 02:11:50.766246
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fdcb7bdb3cb1"
down_revision: Union[str, Sequence[str], None] = "3ca3382e6560"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove doctor_id from appointments and visits."""

    # ---------------------------------------------------------
    # APPOINTMENTS
    # ---------------------------------------------------------

    op.drop_index(
        "ix_appointments_doctor_id",
        table_name="appointments",
    )

    op.drop_constraint(
        "appointments_doctor_id_fkey",
        "appointments",
        type_="foreignkey",
    )

    op.drop_column(
        "appointments",
        "doctor_id",
    )

    # ---------------------------------------------------------
    # VISITS
    # ---------------------------------------------------------

    op.drop_constraint(
        "visits_doctor_id_fkey",
        "visits",
        type_="foreignkey",
    )

    op.drop_column(
        "visits",
        "doctor_id",
    )


def downgrade() -> None:
    """Restore doctor_id to appointments and visits."""

    # ---------------------------------------------------------
    # APPOINTMENTS
    # ---------------------------------------------------------

    op.add_column(
        "appointments",
        sa.Column(
            "doctor_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "appointments_doctor_id_fkey",
        "appointments",
        "staff",
        ["doctor_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_index(
        "ix_appointments_doctor_id",
        "appointments",
        ["doctor_id"],
        unique=False,
    )

    # ---------------------------------------------------------
    # VISITS
    # ---------------------------------------------------------

    op.add_column(
        "visits",
        sa.Column(
            "doctor_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "visits_doctor_id_fkey",
        "visits",
        "staff",
        ["doctor_id"],
        ["id"],
        ondelete="CASCADE",
    )