from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Clinic Management System"
    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str
    SECRET_KEY: str
    DEBUG: bool

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = Settings()