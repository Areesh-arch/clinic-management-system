from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.enums import SubscriptionPlan
from app.crud.subscription_plan import (
    create_plan_config,
    get_plan_config,
)


DEFAULT_PLAN_CONFIGS = [
    {
        "plan": SubscriptionPlan.BASIC,
        "display_name": "Basic",
        "price": Decimal("4999.00"),
        "description": "Essential tools for small clinics.",
        "features": [
            "Patient management",
            "Appointments",
            "Basic billing",
            "Inventory",
        ],
    },
    {
        "plan": SubscriptionPlan.STANDARD,
        "display_name": "Professional",
        "price": Decimal("9999.00"),
        "description": (
            "Complete clinic management for growing practices."
        ),
        "features": [
            "Everything in Basic",
            "Staff management",
            "Treatment records",
            "CRM & CMS",
        ],
    },
    {
        "plan": SubscriptionPlan.PREMIUM,
        "display_name": "Premium",
        "price": Decimal("19999.00"),
        "description": (
            "Advanced tools for established aesthetic clinics."
        ),
        "features": [
            "Everything in Professional",
            "Advanced analytics",
            "Advanced clinic controls",
            "Priority platform support",
        ],
    },
]


def seed_subscription_plan_configs(
    db: Session,
) -> None:

    for item in DEFAULT_PLAN_CONFIGS:

        existing = get_plan_config(
            db,
            item["plan"],
        )

        if existing is None:
            create_plan_config(
                db=db,
                plan=item["plan"],
                display_name=item["display_name"],
                price=item["price"],
                description=item["description"],
                features=item["features"],
            )