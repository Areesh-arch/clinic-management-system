from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import api_router
from app.core.config import settings
from app.api.v1.endpoints import dashboard
from app.api.v1.endpoints.appointment import router as appointment_router
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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


app.include_router(api_router)

app.include_router(dashboard.router)

app.include_router(
    appointment_router,
    prefix="/api/v1",
)