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
    
    # Future extension: Database URL
    # DATABASE_URL: str = "sqlite:///./sql_app.db"
    
    class Config:
        env_file = ".env"

settings = Settings()
