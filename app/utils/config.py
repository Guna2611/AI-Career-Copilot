from dataclasses import dataclass, field
import os

from dotenv import load_dotenv

load_dotenv()


@dataclass(frozen=True)
class Settings:
    APP_NAME: str = "AI Resume Analyzer API"
    APP_VERSION: str = "0.1.0"
    ALLOWED_ORIGINS: list[str] = field(default_factory=lambda: ["*"])
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")


settings = Settings()
