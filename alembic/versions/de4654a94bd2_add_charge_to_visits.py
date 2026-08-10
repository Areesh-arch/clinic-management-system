
"""add charge to visits

Revision ID: de4654a94bd2
Revises: 3c4fecbc1a1d
Create Date: 2026-08-06

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "de4654a94bd2"
down_revision: Union[str, Sequence[str], None] = "3c4fecbc1a1d"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add the new column temporarily as nullable.
    op.add_column(
        "visits",
        sa.Column(
            "charge",
            sa.Numeric(precision=10, scale=2),
            nullable=True,
        ),
    )

    # 2. Give all existing visits a default charge of 0.
    op.execute(
        "UPDATE visits SET charge = 0 WHERE charge IS NULL"
    )

    # 3. Make the column NOT NULL after existing rows
    #    have been populated.
    op.alter_column(
        "visits",
        "charge",
        existing_type=sa.Numeric(
            precision=10,
            scale=2,
        ),
        nullable=False,
    )

    # 4. Add the patient_id index detected by Alembic.
    op.create_index(
        "ix_visits_patient_id",
        "visits",
        ["patient_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_visits_patient_id",
        table_name="visits",
    )

    op.drop_column(
        "visits",
        "charge",
    )

