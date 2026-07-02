import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CyberGate RVG"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/cybergate")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecret-cybergate-key-change-me")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "admin@cybergate.local")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "Admin@123456")
    GATEWAY_DOMAIN: str = os.getenv("GATEWAY_DOMAIN", "localhost")
    
    class Config:
        env_file = ".env"

settings = Settings()
