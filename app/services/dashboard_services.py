from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.models.inventory_item import InventoryItem
from app.models.visit import Visit

def get_dashboard_data(
    db: Session,
    tenant_id: int,
):
    today = date.today()

    # --------------------------------------------------
    # 1. TODAY'S REVENUE
    # --------------------------------------------------

    today_revenue = (
        db.query(func.coalesce(func.sum(Payment.amount), 0))
        .filter(
            Payment.tenant_id == tenant_id,
            Payment.payment_date == today,
        )
        .scalar()
    )

    # --------------------------------------------------
    # 2. TOTAL PATIENTS
    # --------------------------------------------------

    patients_count = (
        db.query(func.count(Patient.id))
        .filter(
            Patient.tenant_id == tenant_id,
            Patient.is_active == True,
        )
        .scalar()
    )

    # --------------------------------------------------
    # 3. TODAY'S APPOINTMENTS
    # --------------------------------------------------

    appointments_count = (
        db.query(func.count(Appointment.id))
        .filter(
            Appointment.tenant_id == tenant_id,
            Appointment.appointment_date == today,
        )
        .scalar()
    )

    # --------------------------------------------------
    # 4. INVENTORY
    # --------------------------------------------------

    inventory_count = (
        db.query(func.count(InventoryItem.id))
        .filter(
            InventoryItem.tenant_id == tenant_id,
        )
        .scalar()
    )

    # --------------------------------------------------
    # 5. LOW STOCK
    # --------------------------------------------------

    low_stock_items = (
        db.query(InventoryItem)
        .filter(
            InventoryItem.tenant_id == tenant_id,
            InventoryItem.quantity <= InventoryItem.minimum_stock,
        )
        .order_by(InventoryItem.quantity.asc())
        .limit(10)
        .all()
    )

    # --------------------------------------------------
    # 6. RECENT PATIENTS
    # --------------------------------------------------

    recent_patients = (
        db.query(Patient)
        .filter(
            Patient.tenant_id == tenant_id,
        )
        .order_by(Patient.created_at.desc())
        .limit(5)
        .all()
    )

    # --------------------------------------------------
    # 7. WEEKLY APPOINTMENTS
    # --------------------------------------------------

    start_of_week = today - timedelta(days=today.weekday())

    weekly_appointments = []

    for i in range(6):
        current_day = start_of_week + timedelta(days=i)

        count = (
            db.query(func.count(Appointment.id))
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

    # --------------------------------------------------
    # RETURN DATA
    # --------------------------------------------------

    return {
        "stats": {
            "today_revenue": today_revenue or 0,
            "patients": patients_count or 0,
            "appointments": appointments_count or 0,
            "inventory": inventory_count or 0,
        },

        "revenue": [],

        "weekly_appointments": weekly_appointments,

        "recent_patients": [
            {
                "name": f"{patient.first_name} {patient.last_name}",
                "treatment": "N/A",
                "status": "Active" if patient.is_active else "Inactive",
            }
            for patient in recent_patients
        ],

        "low_stock": [
            {
                "name": item.name,
                "stock": item.quantity,
            }
            for item in low_stock_items
        ],
    }