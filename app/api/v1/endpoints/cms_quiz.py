from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.api.v1.endpoints.lead import resolve_public_tenant
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.cms_quiz import (
    CMSQuizCreate,
    CMSQuizResponse,
    CMSQuizUpdate,
)

from app.services.cms_quiz_service import (
    create_cms_quiz_service,
    delete_cms_quiz_service,
    get_cms_quiz_service,
    get_cms_quizzes_service,
    update_cms_quiz_service,
)


router = APIRouter(
    prefix="",
    tags=["CMS / Skin Quiz"],
)


# ============================================================
# PUBLIC WEBSITE
# ============================================================

@router.get(
    "/public",
    response_model=list[CMSQuizResponse],
)
def public_quizzes(
    request: Request,
    db: Session = Depends(get_db),
):
    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    return get_cms_quizzes_service(
        db=db,
        tenant_id=tenant.id,
    )


# ============================================================
# CMS / DASHBOARD
# ============================================================

@router.post(
    "/",
    response_model=CMSQuizResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_quiz(
    quiz_data: CMSQuizCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    return create_cms_quiz_service(
        db=db,
        quiz_data=quiz_data,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/",
    response_model=list[CMSQuizResponse],
)
def list_quizzes(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    return get_cms_quizzes_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{quiz_id}",
    response_model=CMSQuizResponse,
)
def get_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    quiz = get_cms_quiz_service(
        db=db,
        quiz_id=quiz_id,
        tenant_id=current_user.tenant_id,
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS quiz question not found",
        )

    return quiz


@router.put(
    "/{quiz_id}",
    response_model=CMSQuizResponse,
)
def update_quiz(
    quiz_id: int,
    quiz_data: CMSQuizUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    quiz = get_cms_quiz_service(
        db=db,
        quiz_id=quiz_id,
        tenant_id=current_user.tenant_id,
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS quiz question not found",
        )

    return update_cms_quiz_service(
        db=db,
        db_quiz=quiz,
        quiz_data=quiz_data,
    )


@router.delete(
    "/{quiz_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_quiz(
    quiz_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    quiz = get_cms_quiz_service(
        db=db,
        quiz_id=quiz_id,
        tenant_id=current_user.tenant_id,
    )

    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS quiz question not found",
        )

    delete_cms_quiz_service(
        db=db,
        db_quiz=quiz,
    )

    return None