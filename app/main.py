from fastapi import FastAPI

from app.api.v1.endpoints import patient
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


@app.get("/")
def home():
    return {
        "message": "Welcome to Clinic Management System"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(patient.router)