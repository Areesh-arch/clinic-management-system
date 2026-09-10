"""Make patient medical record number tenant scoped

Revision ID: db72b2d92653
Revises: 18b6d14868cc
Create Date: 2026-09-09
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "db72b2d92653"
down_revision: Union[str, Sequence[str], None] = "18b6d14868cc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Make medical record numbers unique per tenant."""

    # Remove the old globally-unique index.
    op.drop_index(
        "ix_patients_medical_record_number",
        table_name="patients",
    )

    # Medical record numbers are now unique within each tenant.
    #
    # Example:
    # Tenant 1 -> DC-000001
    # Tenant 2 -> DC-000001
    # Tenant 3 -> DC-000001
    #
    # But the same number cannot occur twice inside one tenant.
    op.create_unique_constraint(
        "uq_patient_tenant_medical_record_number",
        "patients",
        ["tenant_id", "medical_record_number"],
    )

    # Keep a normal index on medical_record_number for lookups.
    op.create_index(
        "ix_patients_medical_record_number",
        "patients",
        ["medical_record_number"],
        unique=False,
    )


def downgrade() -> None:
    """Restore globally-unique medical record numbers."""

    # Remove tenant-scoped unique constraint.
    op.drop_constraint(
        "uq_patient_tenant_medical_record_number",
        "patients",
        type_="unique",
    )

    # Remove the normal index.
    op.drop_index(
        "ix_patients_medical_record_number",
        table_name="patients",
    )

    # Restore the original global unique index.
    op.create_index(
        "ix_patients_medical_record_number",
        "patients",
        ["medical_record_number"],
        unique=True,
    )