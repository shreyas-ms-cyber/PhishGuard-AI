import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from dotenv import load_dotenv
from app.api.v1 import auth, analyze, dashboard, cases, audit
from app.config import settings
from app.database import engine, Base

load_dotenv()

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Heuristic-based phishing email detection API",
)

@app.on_event("startup")
def create_tables():
    Base.metadata.create_all(bind=engine)

# Hardcoded origins – no environment dependency
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
]
print(f"🔧 CORS allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(dashboard.router)
app.include_router(cases.router)
app.include_router(audit.router)

@app.get("/")
async def root():
    return {"message": "PhishGuard AI API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Ensure preflight OPTIONS requests also get CORS headers
@app.options("/{full_path:path}")
async def preflight(request, full_path: str):
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"  # or * for testing
    response.headers["Access-Control-Allow-Methods"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response
