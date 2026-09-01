from sqlalchemy.orm import Session

from app.crud.cms_quiz import (
    create_cms_quiz,
    delete_cms_quiz,
    get_all_cms_quizzes,
    get_cms_quiz,
    update_cms_quiz,
)
from app.models.cms_quiz import CMSQuiz
from app.schemas.cms_quiz import (
    CMSQuizCreate,
    CMSQuizUpdate,
)


def create_cms_quiz_service(
    db: Session,
    quiz_data: CMSQuizCreate,
    tenant_id: int,
) -> CMSQuiz:

    return create_cms_quiz(
        db=db,
        quiz_data=quiz_data,
        tenant_id=tenant_id,
    )


def get_cms_quiz_service(
    db: Session,
    quiz_id: int,
    tenant_id: int,
) -> CMSQuiz | None:

    return get_cms_quiz(
        db=db,
        quiz_id=quiz_id,
        tenant_id=tenant_id,
    )


def get_cms_quizzes_service(
    db: Session,
    tenant_id: int,
) -> list[CMSQuiz]:

    return get_all_cms_quizzes(
        db=db,
        tenant_id=tenant_id,
    )


def update_cms_quiz_service(
    db: Session,
    db_quiz: CMSQuiz,
    quiz_data: CMSQuizUpdate,
) -> CMSQuiz:

    return update_cms_quiz(
        db=db,
        db_quiz=db_quiz,
        quiz_data=quiz_data,
    )


def delete_cms_quiz_service(
    db: Session,
    db_quiz: CMSQuiz,
) -> None:

    delete_cms_quiz(
        db=db,
        db_quiz=db_quiz,
    )