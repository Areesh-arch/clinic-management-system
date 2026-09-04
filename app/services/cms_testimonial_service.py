from sqlalchemy.orm import Session

from app.crud.cms_testimonial import (
    create_cms_testimonial,
    delete_cms_testimonial,
    get_all_cms_testimonials,
    get_cms_testimonial,
    update_cms_testimonial,
)
from app.models.cms_testimonial import CMSTestimonial
from app.schemas.cms_testimonial import (
    CMSTestimonialCreate,
    CMSTestimonialUpdate,
)


def create_cms_testimonial_service(
    db: Session,
    testimonial_data: CMSTestimonialCreate,
    tenant_id: int,
) -> CMSTestimonial:
    return create_cms_testimonial(
        db=db,
        testimonial_data=testimonial_data,
        tenant_id=tenant_id,
    )


def get_cms_testimonial_service(
    db: Session,
    testimonial_id: int,
    tenant_id: int,
) -> CMSTestimonial | None:
    return get_cms_testimonial(
        db=db,
        testimonial_id=testimonial_id,
        tenant_id=tenant_id,
    )


def get_cms_testimonials_service(
    db: Session,
    tenant_id: int,
) -> list[CMSTestimonial]:
    return get_all_cms_testimonials(
        db=db,
        tenant_id=tenant_id,
    )


def update_cms_testimonial_service(
    db: Session,
    db_testimonial: CMSTestimonial,
    testimonial_data: CMSTestimonialUpdate,
) -> CMSTestimonial:
    return update_cms_testimonial(
        db=db,
        db_testimonial=db_testimonial,
        testimonial_data=testimonial_data,
    )


def delete_cms_testimonial_service(
    db: Session,
    db_testimonial: CMSTestimonial,
) -> None:
    delete_cms_testimonial(
        db=db,
        db_testimonial=db_testimonial,
    )