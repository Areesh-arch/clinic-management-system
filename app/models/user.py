from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    name: Mapped[str] = mapped_column(String(100))

    email: Mapped[str] = mapped_column(String(255), unique=True)

    password: Mapped[str] = mapped_column(String(255))

    role: Mapped[str] = mapped_column(String(50))

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)