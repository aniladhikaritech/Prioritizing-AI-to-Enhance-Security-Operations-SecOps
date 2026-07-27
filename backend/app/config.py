import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Powered Automated Incident Response System (SecOps)"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "SECURE_SECOPS_SECRET_KEY_CHANGE_IN_PRODUCTION_9823471982")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # PostgreSQL Configuration
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "secops")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "secops_password123")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "secops_db")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    # Primary Database URL - Defaults to PostgreSQL if POSTGRES_SERVER is set, else SQLite fallback
    DATABASE_URL: Optional[str] = None

    def get_database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL
        env_db_url = os.getenv("DATABASE_URL")
        if env_db_url:
            return env_db_url
        
        # Build PostgreSQL URL if specified in environment, else fallback to SQLite
        if os.getenv("USE_POSTGRES", "false").lower() == "true":
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        return "sqlite:///./secops.db"
    
    # AI Engine Configuration
    # Modes: "smart_local" (default offline engine), "ollama" (local LLaMA 3), "openai"
    AI_ENGINE_MODE: str = os.getenv("AI_ENGINE_MODE", "smart_local")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")
    
    # SOAR Thresholds
    FAILED_LOGIN_THRESHOLD: int = 5
    TIME_WINDOW_SECONDS: int = 60
    AUTO_BLOCK_RISK_THRESHOLD: int = 80
    
    class Config:
        case_sensitive = True

settings = Settings()
