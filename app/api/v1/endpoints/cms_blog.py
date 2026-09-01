from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.database.session import get_db
from app.models.enums import UserRole
from app.models.user import User

from app.schemas.cms_blog import (
    CMSBlogCreate,
    CMSBlogResponse,
    CMSBlogUpdate,
)

from app.services.cms_blog_service import (
    create_cms_blog_service,
    delete_cms_blog_service,
    get_cms_blog_service,
    get_cms_blogs_service,
    update_cms_blog_service,
)


router = APIRouter(
    prefix="",
    tags=["CMS / News & Blogs"],
)


@router.post(
    "/",
    response_model=CMSBlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_blog(
    blog_data: CMSBlogCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    return create_cms_blog_service(
        db=db,
        blog_data=blog_data,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/",
    response_model=list[CMSBlogResponse],
)
def list_blogs(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    return get_cms_blogs_service(
        db=db,
        tenant_id=current_user.tenant_id,
    )


@router.get(
    "/{blog_id}",
    response_model=CMSBlogResponse,
)
def get_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    blog = get_cms_blog_service(
        db=db,
        blog_id=blog_id,
        tenant_id=current_user.tenant_id,
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS blog not found",
        )

    return blog


@router.put(
    "/{blog_id}",
    response_model=CMSBlogResponse,
)
def update_blog(
    blog_id: int,
    blog_data: CMSBlogUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    blog = get_cms_blog_service(
        db=db,
        blog_id=blog_id,
        tenant_id=current_user.tenant_id,
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS blog not found",
        )

    return update_cms_blog_service(
        db=db,
        db_blog=blog,
        blog_data=blog_data,
    )


@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_roles(
            UserRole.OWNER,
            UserRole.STAFF,
            UserRole.SUPER_ADMIN,
        )
    ),
):

    blog = get_cms_blog_service(
        db=db,
        blog_id=blog_id,
        tenant_id=current_user.tenant_id,
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS blog not found",
        )

    delete_cms_blog_service(
        db=db,
        db_blog=blog,
    )

    return None