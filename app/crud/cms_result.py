from sqlalchemy.orm import Session

from app.models.cms_result import CMSResult


# =========================================================
# CREATE
# =========================================================

def create_cms_result(
    db: Session,
    tenant_id: int,
    title: str,
    slug: str,
    description: str | None,
    before_image_url: str | None,
    after_image_url: str | None,
    treatment_name: str | None,
    display_order: int,
    is_active: bool,
) -> CMSResult:

    db_result = CMSResult(
        tenant_id=tenant_id,
        title=title,
        slug=slug,
        description=description,
        before_image_url=before_image_url,
        after_image_url=after_image_url,
        treatment_name=treatment_name,
        display_order=display_order,
        is_active=is_active,
    )

    db.add(db_result)
    db.commit()
    db.refresh(db_result)

    return db_result


# =========================================================
# GET BY ID
# =========================================================

def get_cms_result(
    db: Session,
    result_id: int,
    tenant_id: int,
) -> CMSResult | None:

    return (
        db.query(CMSResult)
        .filter(
            CMSResult.id == result_id,
            CMSResult.tenant_id == tenant_id,
        )
        .first()
    )


# =========================================================
# GET ALL
# =========================================================

def get_all_cms_results(
    db: Session,
    tenant_id: int,
) -> list[CMSResult]:

    return (
        db.query(CMSResult)
        .filter(
            CMSResult.tenant_id == tenant_id,
        )
        .order_by(
            CMSResult.display_order.asc(),
            CMSResult.id.asc(),
        )
        .all()
    )


# =========================================================
# UPDATE
# =========================================================

def update_cms_result(
    db: Session,
    db_result: CMSResult,
    title: str | None,
    slug: str | None,
    description: str | None,
    before_image_url: str | None,
    after_image_url: str | None,
    treatment_name: str | None,
    display_order: int | None,
    is_active: bool | None,
) -> CMSResult:

    if title is not None:
        db_result.title = title

    if slug is not None:
        db_result.slug = slug

    if description is not None:
        db_result.description = description

    if before_image_url is not None:
        db_result.before_image_url = before_image_url

    if after_image_url is not None:
        db_result.after_image_url = after_image_url

    if treatment_name is not None:
        db_result.treatment_name = treatment_name

    if display_order is not None:
        db_result.display_order = display_order

    if is_active is not None:
        db_result.is_active = is_active

    db.commit()
    db.refresh(db_result)

    return db_result


# =========================================================
# DELETE
# =========================================================

def delete_cms_result(
    db: Session,
    db_result: CMSResult,
) -> None:

    db.delete(db_result)
    db.commit()