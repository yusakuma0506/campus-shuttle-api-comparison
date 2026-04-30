from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.health import router as health_router
from app.core.config import settings


app = FastAPI(
    title="Campus Shuttle API",
    description="FastAPI implementation for Campus Shuttle API Comparison",
    version="1.0.0"
)

# CORS allows your Next.js frontend to call this backend.
# frontend-nextjs runs on http://localhost:3000.
# backend-fastapi runs on http://localhost:8000.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint.
# This is just a simple message when you access http://localhost:8000/
@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "message": "Campus Shuttle API is running"
    }


# Register health router.
# health.py has prefix="/health"
# here we add prefix="/api/v1"
# final URL: /api/v1/health
app.include_router(health_router, prefix="/api/v1")