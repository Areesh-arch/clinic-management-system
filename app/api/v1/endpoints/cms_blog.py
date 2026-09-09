from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.api.permissions import require_roles
from app.api.tenant_context import get_effective_tenant_id
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
    get_cms_blog_by_slug_service,
    get_cms_blog_service,
    get_cms_blogs_service,
    update_cms_blog_service,
)

from app.api.v1.endpoints.lead import resolve_public_tenant


router = APIRouter(
    prefix="",
    tags=["CMS / News & Blogs"],
)


# ============================================================
# PUBLIC WEBSITE — LIST PUBLISHED BLOGS
# ============================================================

@router.get(
    "/public",
    response_model=list[CMSBlogResponse],
)
def list_public_blogs(
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Return published blogs for the public clinic website.

    The clinic is automatically identified from the
    website hostname/origin.

    Example:

        http://shaclinic.localhost:5173

    resolves to:

        shaclinic
    """

    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    blogs = get_cms_blogs_service(
        db=db,
        tenant_id=tenant.id,
    )

    return [
        blog
        for blog in blogs
        if blog.is_published is True
    ]


# ============================================================
# PUBLIC WEBSITE — GET ONE BLOG BY SLUG
# ============================================================

@router.get(
    "/public/{slug}",
    response_model=CMSBlogResponse,
)
def get_public_blog(
    slug: str,
    request: Request,
    db: Session = Depends(get_db),
):
    """
    Return one published blog for the public website.

    The blog is identified by its slug.

    Example:

        /cms/blogs/public/understanding-your-skin
    """

    tenant = resolve_public_tenant(
        request=request,
        db=db,
    )

    blog = get_cms_blog_by_slug_service(
        db=db,
        slug=slug,
        tenant_id=tenant.id,
    )

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS blog not found",
        )

    return blog


# ============================================================
# AUTHENTICATED CMS — CREATE
# ============================================================

@router.post(
    "/",
    response_model=CMSBlogResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_blog(
    blog_data: CMSBlogCreate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
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
        tenant_id=tenant_id,
    )


# ============================================================
# AUTHENTICATED CMS — LIST
# ============================================================

@router.get(
    "/",
    response_model=list[CMSBlogResponse],
)
def list_blogs(
    db: Session = Depends(get_db),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
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
        tenant_id=tenant_id,
    )


# ============================================================
# AUTHENTICATED CMS — GET ONE
# ============================================================

@router.get(
    "/{blog_id}",
    response_model=CMSBlogResponse,
)
def get_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
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
        tenant_id=tenant_id,
    )

    if not blog:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="CMS blog not found",
        )

    return blog


# ============================================================
# AUTHENTICATED CMS — UPDATE
# ============================================================

@router.put(
    "/{blog_id}",
    response_model=CMSBlogResponse,
)
def update_blog(
    blog_id: int,
    blog_data: CMSBlogUpdate,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
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
        tenant_id=tenant_id,
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


# ============================================================
# AUTHENTICATED CMS — DELETE
# ============================================================

@router.delete(
    "/{blog_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    tenant_id: int = Depends(
        get_effective_tenant_id
    ),
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
        tenant_id=tenant_id,
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