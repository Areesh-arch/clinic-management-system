"""add patient portal user link

Revision ID: 67cb6ae8d6f6
Revises: e9c76c01cd5f
Create Date: 2026-09-25 22:01:48.303080
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "67cb6ae8d6f6"
down_revision: Union[str, Sequence[str], None] = "e9c76c01cd5f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "users",
        sa.Column(
            "patient_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_users_patient_id",
        "users",
        ["patient_id"],
        unique=True,
    )

    op.create_foreign_key(
        "fk_users_patient_id_patients",
        "users",
        "patients",
        ["patient_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "fk_users_patient_id_patients",
        "users",
        type_="foreignkey",
    )

    op.drop_index(
        "ix_users_patient_id",
        table_name="users",
    )

    op.drop_column(
        "users",
        "patient_id",
    )