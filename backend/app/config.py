import os
from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App Info
    APP_NAME: str = "Academic Paper Recommender API"
    VERSION: str = "1.0.0"
    APP_ENV: str = "development" # 'development' or 'production'

    # CORS Configuration (Phase 2.1.1 - Security)
    # Allows the React frontend to communicate with this backend
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite Local Dev
        "http://127.0.0.1:5173"
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