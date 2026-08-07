from sqlalchemy.orm import Session

from app.crud.treatment_photo import (
    create_treatment_photo,
    get_treatment_photo_by_id,
    get_treatment_photos,
    update_treatment_photo,
    delete_treatment_photo,
)

from app.models.treatment_photo import TreatmentPhoto
from app.models.visit import Visit

from app.schemas.treatment_photo import (
    TreatmentPhotoCreate,
    TreatmentPhotoUpdate,
)


def create_treatment_photo_service(
    db: Session,
    photo_data: TreatmentPhotoCreate,
    tenant_id: int,
):
    visit = (
        db.query(Visit)
        .filter(
            Visit.id == photo_data.visit_id,
            Visit.tenant_id == tenant_id,
        )
        .first()
    )

    if visit is None:
        raise ValueError(
            "Visit not found."
        )

    return create_treatment_photo(
        db=db,
        photo_data=photo_data,
        tenant_id=tenant_id,
    )


def get_treatment_photo_service(
    db: Session,
    photo_id: int,
):
    photo = get_treatment_photo_by_id(
        db=db,
        photo_id=photo_id,
    )

    if photo is None:
        raise ValueError(
            "Treatment photo not found."
        )

    return photo


def list_treatment_photos_service(
    db: Session,
    tenant_id: int,
):
    return get_treatment_photos(
        db=db,
        tenant_id=tenant_id,
    )


def update_treatment_photo_service(
    db: Session,
    photo: TreatmentPhoto,
    photo_data: TreatmentPhotoUpdate,
):
    return update_treatment_photo(
        db=db,
        photo=photo,
        photo_data=photo_data,
    )


def delete_treatment_photo_service(
    db: Session,
    photo: TreatmentPhoto,
):
    delete_treatment_photo(
        db=db,
        photo=photo,
    )