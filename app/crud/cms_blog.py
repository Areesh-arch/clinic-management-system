from sqlalchemy.orm import Session

from app.models.cms_blog import CMSBlog
from app.schemas.cms_blog import (
    CMSBlogCreate,
    CMSBlogUpdate,
)


def create_cms_blog(
    db: Session,
    blog_data: CMSBlogCreate,
    tenant_id: int,
) -> CMSBlog:

    db_blog = CMSBlog(
        tenant_id=tenant_id,
        **blog_data.model_dump(),
    )

    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)

    return db_blog


def get_cms_blog(
    db: Session,
    blog_id: int,
    tenant_id: int,
) -> CMSBlog | None:

    return (
        db.query(CMSBlog)
        .filter(
            CMSBlog.id == blog_id,
            CMSBlog.tenant_id == tenant_id,
        )
        .first()
    )


def get_cms_blog_by_slug(
    db: Session,
    slug: str,
    tenant_id: int,
) -> CMSBlog | None:

    return (
        db.query(CMSBlog)
        .filter(
            CMSBlog.slug == slug,
            CMSBlog.tenant_id == tenant_id,
            CMSBlog.is_published.is_(True),
        )
        .first()
    )


def get_all_cms_blogs(
    db: Session,
    tenant_id: int,
) -> list[CMSBlog]:

    return (
        db.query(CMSBlog)
        .filter(
            CMSBlog.tenant_id == tenant_id,
        )
        .order_by(
            CMSBlog.display_order.asc(),
            CMSBlog.id.desc(),
        )
        .all()
    )


def update_cms_blog(
    db: Session,
    db_blog: CMSBlog,
    blog_data: CMSBlogUpdate,
) -> CMSBlog:

    update_data = blog_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(db_blog, field, value)

    db.commit()
    db.refresh(db_blog)

    return db_blog


def delete_cms_blog(
    db: Session,
    db_blog: CMSBlog,
) -> None:

    db.delete(db_blog)
    db.commit()