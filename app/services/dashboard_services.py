from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.inventory_item import InventoryItem


def get_dashboard_data(
    db: Session,
    tenant_id: int,
):
    today = date.today()

    # ==================================================
    # 1. TODAY'S REVENUE
    # ==================================================

    today_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .filter(
            Payment.tenant_id == tenant_id,
            Payment.payment_date == today,
        )
        .scalar()
    )

    # ==================================================
    # 2. TOTAL ACTIVE PATIENTS
    # ==================================================

    patients_count = (
        db.query(func.count(Patient.id))
        .filter(
            Patient.tenant_id == tenant_id,
            Patient.is_active.is_(True),
        )
        .scalar()
    )

    # ==================================================
    # 3. TODAY'S APPOINTMENTS
    # ==================================================

    appointments_count = (
        db.query(func.count(Appointment.id))
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.appointment_date == today,
        )
        .scalar()
    )

    # ==================================================
    # 4. TOTAL INVENTORY ITEMS
    # ==================================================

    inventory_count = (
        db.query(func.count(InventoryItem.id))
        .filter(
            InventoryItem.tenant_id == tenant_id,
        )
        .scalar()
    )

    # ==================================================
    # 5. LOW STOCK
    # ==================================================

    low_stock_items = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.quantity <= InventoryItem.minimum_stock,
        )
        .order_by(
            InventoryItem.quantity.asc()
        )
        .limit(10)
        .all()
    )

    # ==================================================
    # 6. RECENT PATIENTS
    # ==================================================

    recent_patients = (
        db.query(Patient)
        .filter(
            Patient.tenant_id == tenant_id,
        )
        .order_by(
            Patient.created_at.desc()
        )
        .limit(5)
        .all()
    )

    # ==================================================
    # 7. WEEKLY APPOINTMENTS
    # ==================================================

    start_of_week = (
        today - timedelta(
            days=today.weekday()
        )
    )

    weekly_appointments = []

    # Monday -> Sunday
    for i in range(7):
        current_day = (
            start_of_week
            + timedelta(days=i)
        )

        count = (
            db.query(
                func.count(
                    Appointment.id
                )
            )
            .filter(
                Appointment.tenant_id == tenant_id,
                Appointment.appointment_date == current_day,
            )
            .scalar()
        )

        weekly_appointments.append(
            {
                "day": current_day.strftime("%a"),
                "appointments": count or 0,
            }
        )

    # ==================================================
    # 8. REVENUE CHART
    # ==================================================

    revenue = []

    # Last 7 days
    for i in range(6, -1, -1):
        current_day = (
            today - timedelta(days=i)
        )

        amount = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0,
                )
            )
            .filter(
                Payment.tenant_id == tenant_id,
                Payment.payment_date == current_day,
            )
            .scalar()
        )

        revenue.append(
            {
                "date": current_day.isoformat(),
                "day": current_day.strftime("%a"),
                "revenue": float(
                    amount or 0
                ),
            }
        )

    # ==================================================
    # 9. RETURN DASHBOARD DATA
    # ==================================================

    return {
        "stats": {
            "today_revenue": float(
                today_revenue or 0
            ),
            "patients": patients_count or 0,
            "appointments": appointments_count or 0,
            "inventory": inventory_count or 0,
        },

        "revenue": revenue,

        "weekly_appointments": weekly_appointments,

        "recent_patients": [
            {
                "id": patient.id,
                "name": (
                    f"{patient.first_name} "
                    f"{patient.last_name}"
                ).strip(),
                "first_name": patient.first_name,
                "last_name": patient.last_name,
                "medical_record_number": (
                    patient.medical_record_number
                ),
                "status": (
                    "Active"
                    if patient.is_active
                    else "Inactive"
                ),
            }
            for patient in recent_patients
        ],

        "low_stock": [
            {
                "id": item.id,
                "name": item.name,
                "stock": item.quantity,
                "minimum_stock": item.minimum_stock,
                "unit": item.unit,
            }
            for item in low_stock_items
        ],
    }