import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "Academic Paper Recommender API"
    VERSION: str = "1.0.0"
    APP_ENV: str = "development" # 'development' or 'production'

    # Security Configuration
    SECRET_KEY: str = "offline-local-secret-key-change-me-if-exposed"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 Days (Long login for convenience)

    # CORS Configuration (Phase 2.1.1 - Security)
    # Allows the React frontend to communicate with this backend
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Standard Vite
        "http://localhost:5174",  # Fallback Vite port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174"
    ]

    # AI Configuration
    MODEL_NAME: str = "all-MiniLM-L6-v2"

    # Path Configuration
    # We calculate base path relative to this file to ensure robustness
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    class Config:
        env_file = ".env"
        case_sensitive = True

# Dependency Injection for Settings
# lru_cache ensures we read the file only once, not on every request
@lru_cache()
def get_settings():
    return Settings()