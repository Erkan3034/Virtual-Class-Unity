import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Virtual Classroom AI Backend"
    API_VERSION: str = "v1.0"
    DEBUG: bool = True
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "*"  # For testing/MVP
    ]
    
    # Security
    SECRET_KEY: str = "super-secret-key-for-dev-only"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # Future extension: Database URL
    DATABASE_URL: str = "sqlite:///./sql_app.db"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"

settings = Settings()
