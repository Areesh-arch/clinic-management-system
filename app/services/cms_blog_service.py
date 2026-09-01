from sqlalchemy.orm import Session

from app.crud.cms_blog import (
    create_cms_blog,
    delete_cms_blog,
    get_all_cms_blogs,
    get_cms_blog,
    update_cms_blog,
)
from app.models.cms_blog import CMSBlog
from app.schemas.cms_blog import (
    CMSBlogCreate,
    CMSBlogUpdate,
)


def create_cms_blog_service(
    db: Session,
    blog_data: CMSBlogCreate,
    tenant_id: int,
) -> CMSBlog:

    return create_cms_blog(
        db=db,
        blog_data=blog_data,
        tenant_id=tenant_id,
    )


def get_cms_blog_service(
    db: Session,
    blog_id: int,
    tenant_id: int,
) -> CMSBlog | None:

    return get_cms_blog(
        db=db,
        blog_id=blog_id,
        tenant_id=tenant_id,
    )


def get_cms_blogs_service(
    db: Session,
    tenant_id: int,
) -> list[CMSBlog]:

    return get_all_cms_blogs(
        db=db,
        tenant_id=tenant_id,
    )


def update_cms_blog_service(
    db: Session,
    db_blog: CMSBlog,
    blog_data: CMSBlogUpdate,
) -> CMSBlog:

    return update_cms_blog(
        db=db,
        db_blog=db_blog,
        blog_data=blog_data,
    )


def delete_cms_blog_service(
    db: Session,
    db_blog: CMSBlog,
) -> None:

    delete_cms_blog(
        db=db,
        db_blog=db_blog,
    )