from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.cms_result import CMSResultResponse

from app.services.cms_result_service import (
    create_cms_result_service,
    delete_cms_result_service,
    get_cms_result_service,
    get_cms_results_service,
    update_cms_result_service,
)

from app.api.v1.endpoints.lead import resolve_public_tenant


router = APIRouter(
    prefix="",
    tags=["CMS / Results"],
)


# =========================================================
# PUBLIC WEBSITE — LIST RESULTS
# =========================================================

@router.get(
    "/public",
    response_model=list[CMSResultResponse],
)
def public_results(
    request: Request,
    db: Session = Depends(get_db),
):
    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    return get_cms_results_service(
        db=db,
        tenant_id=tenant.id,
    )


# =========================================================
# CREATE RESULT
# =========================================================

@router.post(
    "/",
    response_model=CMSResultResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_result(
    title: str = Form(...),
    slug: str = Form(...),
    description: str | None = Form(None),
    treatment_name: str | None = Form(None),
    display_order: int = Form(0),
    is_active: bool = Form(True),
    before_image: UploadFile | None = File(None),
    after_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return await create_cms_result_service(
        db=db,
        title=title,
        slug=slug,
        description=description,
        treatment_name=treatment_name,
        display_order=display_order,
        is_active=is_active,
        before_image=before_image,
        after_image=after_image,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# LIST RESULTS — DASHBOARD
# =========================================================

@router.get(
    "/",
    response_model=list[CMSResultResponse],
)
def list_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    return get_cms_results_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


# =========================================================
# GET SINGLE RESULT
# =========================================================

@router.get(
    "/{result_id}",
    response_model=CMSResultResponse,
)
def get_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    result = get_cms_result_service(
        db=db,
        result_id=result_id,
        tenant_id=current_user.tenant_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS result not found",
        )

    return result


# =========================================================
# UPDATE RESULT
# =========================================================

@router.put(
    "/{result_id}",
    response_model=CMSResultResponse,
)
async def update_result(
    result_id: int,
    title: str | None = Form(None),
    slug: str | None = Form(None),
    description: str | None = Form(None),
    treatment_name: str | None = Form(None),
    display_order: int | None = Form(None),
    is_active: bool | None = Form(None),
    before_image: UploadFile | None = File(None),
    after_image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    result = get_cms_result_service(
        db=db,
        result_id=result_id,
        tenant_id=current_user.tenant_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS result not found",
        )

    return await update_cms_result_service(
        db=db,
        db_result=result,
        title=title,
        slug=slug,
        description=description,
        treatment_name=treatment_name,
        display_order=display_order,
        is_active=is_active,
        before_image=before_image,
        after_image=after_image,
    )


# =========================================================
# DELETE RESULT
# =========================================================

@router.delete(
    "/{result_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_result(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):
    result = get_cms_result_service(
        db=db,
        result_id=result_id,
        tenant_id=current_user.tenant_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS result not found",
        )

    delete_cms_result_service(
        db=db,
        db_result=result,
    )

    return None