from sqlalchemy.orm import Session

from app.models.cms_testimonial import CMSTestimonial
from app.schemas.cms_testimonial import (
    CMSTestimonialCreate,
    CMSTestimonialUpdate,
)


def create_cms_testimonial(
    db: Session,
    testimonial_data: CMSTestimonialCreate,
    tenant_id: int,
) -> CMSTestimonial:
    db_testimonial = CMSTestimonial(
        tenant_id=tenant_id,
        **testimonial_data.model_dump(),
    )

    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)

    return db_testimonial


def get_cms_testimonial(
    db: Session,
    testimonial_id: int,
    tenant_id: int,
) -> CMSTestimonial | None:
    return (
        db.query(CMSTestimonial)
        .filter(
            CMSTestimonial.id == testimonial_id,
            CMSTestimonial.tenant_id == tenant_id,
        )
        .first()
    )


def get_all_cms_testimonials(
    db: Session,
    tenant_id: int,
) -> list[CMSTestimonial]:
    return (
        db.query(CMSTestimonial)
        .filter(
            CMSTestimonial.tenant_id == tenant_id,
        )
        .order_by(
            CMSTestimonial.display_order.asc(),
            CMSTestimonial.id.asc(),
        )
        .all()
    )


def update_cms_testimonial(
    db: Session,
    db_testimonial: CMSTestimonial,
    testimonial_data: CMSTestimonialUpdate,
) -> CMSTestimonial:
    update_data = testimonial_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(db_testimonial, field, value)

    db.commit()
    db.refresh(db_testimonial)

    return db_testimonial


def delete_cms_testimonial(
    db: Session,
    db_testimonial: CMSTestimonial,
) -> None:
    db.delete(db_testimonial)
    db.commit()