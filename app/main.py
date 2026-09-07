from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes import api_router
from app.core.config import settings


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,

    # Normal dashboard/frontend origins
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    # Clinic public websites:
    # areesha.localhost:5173
    # glowskin.localhost:5173
    # clinic-a.localhost:5173
    #
    # Also allows different development ports.
    allow_origin_regex=r"^https?://[a-zA-Z0-9-]+\.localhost(?::\d+)?$",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Welcome to Clinic Management System"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# =========================================================
# ROUTERS
# =========================================================

app.include_router(api_router)

