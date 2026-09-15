from sqlalchemy.orm import Session

from app.models.enums import SubscriptionPlan
from app.models.subscription_plan import (
    SubscriptionPlanConfig,
)


def get_all_plan_configs(
    db: Session,
) -> list[SubscriptionPlanConfig]:
    return (
        db.query(SubscriptionPlanConfig)
        .order_by(SubscriptionPlanConfig.id.asc())
        .all()
    )


def get_plan_config(
    db: Session,
    plan: SubscriptionPlan,
) -> SubscriptionPlanConfig | None:
    return (
        db.query(SubscriptionPlanConfig)
        .filter(
            SubscriptionPlanConfig.plan == plan
        )
        .first()
    )


def create_plan_config(
    db: Session,
    plan: SubscriptionPlan,
    display_name: str,
    price,
    description: str,
    features: list[str],
) -> SubscriptionPlanConfig:

    config = SubscriptionPlanConfig(
        plan=plan,
        display_name=display_name,
        price=price,
        description=description,
        features=features,
    )

    db.add(config)
    db.commit()
    db.refresh(config)

    return config


def update_plan_config(
    db: Session,
    config: SubscriptionPlanConfig,
    display_name: str,
    price,
    description: str,
    features: list[str],
) -> SubscriptionPlanConfig:

    config.display_name = display_name
    config.price = price
    config.description = description
    config.features = features

    db.commit()
    db.refresh(config)

    return config