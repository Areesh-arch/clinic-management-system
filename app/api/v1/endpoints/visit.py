from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.api.features import require_feature
from app.models.feature import Feature

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
from app.database.session import get_db

from app.models.enums import UserRole
from app.models.user import User

from app.schemas.visit import (
    VisitCreate,
    VisitResponse,
    VisitUpdate,
)

from app.services.visit_service import (
    create_visit_service,
    delete_visit_service,
    get_visit_service,
    list_visits_service,
    list_archived_visits_service,
    update_visit_service,
    archive_visit_service,
    restore_visit_service,
    permanently_delete_visit_service,
)


router = APIRouter()


# =========================================================
# GET ALL ACTIVE VISITS
# =========================================================

@router.get(
    "",
    response_model=list[VisitResponse],
)
@router.get(
    "/",
    response_model=list[VisitResponse],
    include_in_schema=False,
)
def list_visits(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    return list_visits_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET ARCHIVED VISITS
# IMPORTANT: Must come before /{visit_id}
# =========================================================

@router.get(
    "/archived",
    response_model=list[VisitResponse],
)
def list_archived_visits(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    return list_archived_visits_service(
        db=db,
        tenant_id=tenant_id,
    )


# =========================================================
# GET SINGLE ACTIVE VISIT
# =========================================================

@router.get(
    "/{visit_id}",
    response_model=VisitResponse,
)
def get_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return get_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# CREATE VISIT
# =========================================================

@router.post(
    "",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
)
@router.post(
    "/",
    response_model=VisitResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def create_visit(
    visit: VisitCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return create_visit_service(
            db=db,
            visit_data=visit,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# =========================================================
# UPDATE VISIT
# =========================================================

@router.put(
    "/{visit_id}",
    response_model=VisitResponse,
)
def update_visit(
    visit_id: int,
    visit_data: VisitUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return update_visit_service(
            db=db,
            visit_id=visit_id,
            visit_data=visit_data,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# ARCHIVE VISIT
# =========================================================

@router.post(
    "/{visit_id}/archive",
    response_model=VisitResponse,
)
def archive_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return archive_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# RESTORE VISIT
# =========================================================

@router.post(
    "/{visit_id}/restore",
    response_model=VisitResponse,
)
def restore_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        return restore_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=tenant_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# NORMAL DELETE → ARCHIVE
# =========================================================

@router.delete(
    "/{visit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        delete_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


# =========================================================
# PERMANENT DELETE
# ONLY ARCHIVED VISITS CAN BE PERMANENTLY DELETED
# =========================================================

@router.delete(
    "/{visit_id}/permanent",
    status_code=status.HTTP_204_NO_CONTENT,
)
def permanently_delete_visit(
    visit_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
    _: User = Depends(
        require_feature(Feature.VISITS)
    ),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
):
    try:
        permanently_delete_visit_service(
            db=db,
            visit_id=visit_id,
            tenant_id=tenant_id,
        )

        return None

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )