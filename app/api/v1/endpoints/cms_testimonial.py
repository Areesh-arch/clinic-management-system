from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.cms_testimonial import (
    CMSTestimonialCreate,
    CMSTestimonialResponse,
    CMSTestimonialUpdate,
)

from app.services.cms_testimonial_service import (
    create_cms_testimonial_service,
    delete_cms_testimonial_service,
    get_cms_testimonial_service,
    get_cms_testimonials_service,
    update_cms_testimonial_service,
)

from app.api.v1.endpoints.lead import resolve_public_tenant


router = APIRouter()


# =========================================================
# PUBLIC WEBSITE — LIST TESTIMONIALS
# =========================================================

@router.get(
    "/public",
    response_model=list[CMSTestimonialResponse],
)
def public_testimonials(
    request: Request,
    db: Session = Depends(get_db),
):
    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    return get_cms_testimonials_service(
        db=db,
        tenant_id=tenant.id,
    )


# =========================================================
# CREATE TESTIMONIAL
# =========================================================

@router.post(
    "/",
    response_model=CMSTestimonialResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_testimonial(
    testimonial_data: CMSTestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(get_effective_tenant_id),
):
    return create_cms_testimonial_service(
        db=db,
        testimonial_data=testimonial_data,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ALL TESTIMONIALS
# =========================================================

@router.get(
    "/",
    response_model=list[CMSTestimonialResponse],
)
def get_testimonials(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(get_effective_tenant_id),
):
    return get_cms_testimonials_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET SINGLE TESTIMONIAL
# =========================================================

@router.get(
    "/{testimonial_id}",
    response_model=CMSTestimonialResponse,
)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(get_effective_tenant_id),
):
    testimonial = get_cms_testimonial_service(
        db=db,
        testimonial_id=testimonial_id,
        tenant_id=tenant_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS testimonial not found",
        )

    return testimonial


# =========================================================
# UPDATE TESTIMONIAL
# =========================================================

@router.put(
    "/{testimonial_id}",
    response_model=CMSTestimonialResponse,
)
def update_testimonial(
    testimonial_id: int,
    testimonial_data: CMSTestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(get_effective_tenant_id),
):
    testimonial = get_cms_testimonial_service(
        db=db,
        testimonial_id=testimonial_id,
        tenant_id=tenant_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS testimonial not found",
        )

    return update_cms_testimonial_service(
        db=db,
        db_testimonial=testimonial,
        testimonial_data=testimonial_data,
    )


# =========================================================
# DELETE TESTIMONIAL
# =========================================================

@router.delete(
    "/{testimonial_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    tenant_id: int = Depends(get_effective_tenant_id),
):
    testimonial = get_cms_testimonial_service(
        db=db,
        testimonial_id=testimonial_id,
        tenant_id=tenant_id,
    )

    if testimonial is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS testimonial not found",
        )

    delete_cms_testimonial_service(
        db=db,
        db_testimonial=testimonial,
    )

    return None