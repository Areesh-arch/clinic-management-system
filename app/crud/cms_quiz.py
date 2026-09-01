from sqlalchemy.orm import Session

from app.models.cms_quiz import CMSQuiz
from app.schemas.cms_quiz import (
    CMSQuizCreate,
    CMSQuizUpdate,
)


def create_cms_quiz(
    db: Session,
    quiz_data: CMSQuizCreate,
    tenant_id: int,
) -> CMSQuiz:

    db_quiz = CMSQuiz(
        tenant_id=tenant_id,
        **quiz_data.model_dump(),
    )

    db.add(db_quiz)
    db.commit()
    db.refresh(db_quiz)

    return db_quiz


def get_cms_quiz(
    db: Session,
    quiz_id: int,
    tenant_id: int,
) -> CMSQuiz | None:

    return (
        db.query(CMSQuiz)
        .filter(
            CMSQuiz.id == quiz_id,
            CMSQuiz.tenant_id == tenant_id,
        )
        .first()
    )


def get_all_cms_quizzes(
    db: Session,
    tenant_id: int,
) -> list[CMSQuiz]:

    return (
        db.query(CMSQuiz)
        .filter(
            CMSQuiz.tenant_id == tenant_id,
        )
        .order_by(
            CMSQuiz.display_order.asc(),
            CMSQuiz.id.asc(),
        )
        .all()
    )


def update_cms_quiz(
    db: Session,
    db_quiz: CMSQuiz,
    quiz_data: CMSQuizUpdate,
) -> CMSQuiz:

    update_data = quiz_data.model_dump(
        exclude_unset=True,
    )

    for field, value in update_data.items():
        setattr(db_quiz, field, value)

    db.commit()
    db.refresh(db_quiz)

    return db_quiz


def delete_cms_quiz(
    db: Session,
    db_quiz: CMSQuiz,
) -> None:

    db.delete(db_quiz)
    db.commit()