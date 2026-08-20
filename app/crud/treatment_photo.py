from sqlalchemy.orm import Session

from app.models.treatment_photo import TreatmentPhoto

from app.schemas.treatment_photo import (
    TreatmentPhotoCreate,
    TreatmentPhotoUpdate,
)


def create_treatment_photo(
    db: Session,
    photo_data: TreatmentPhotoCreate,
    tenant_id: int,
) -> TreatmentPhoto:

    photo = TreatmentPhoto(
        tenant_id=tenant_id,
        visit_id=photo_data.visit_id,
        photo_type=photo_data.photo_type,
        image_url=photo_data.image_url,
        caption=photo_data.caption,
    )

    db.add(photo)
    db.commit()
    db.refresh(photo)

    return photo


def get_treatment_photo_by_id(
    db: Session,
    photo_id: int,
    tenant_id: int,
):
    return (
        db.query(TreatmentPhoto)
        .filter(
            TreatmentPhoto.id == photo_id,
            TreatmentPhoto.tenant_id == tenant_id,
        )
        .first()
    )


def get_treatment_photos(
    db: Session,
    tenant_id: int,
):
    return (
        db.query(TreatmentPhoto)
        .filter(
            TreatmentPhoto.tenant_id == tenant_id
        )
        .order_by(
            TreatmentPhoto.created_at.desc()
        )
        .all()
    )


def update_treatment_photo(
    db: Session,
    photo: TreatmentPhoto,
    photo_data: TreatmentPhotoUpdate,
):

    update_data = photo_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(photo, key, value)

    db.commit()
    db.refresh(photo)

    return photo


def delete_treatment_photo(
    db: Session,
    photo: TreatmentPhoto,
):

    db.delete(photo)
    db.commit()