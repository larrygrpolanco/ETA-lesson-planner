import os
from pathlib import Path
from dotenv import load_dotenv

# Get the project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Load environment variables from .env file in project root
load_dotenv(PROJECT_ROOT / ".env")


class Config:
    """Base configuration."""

    # Flask
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV == "development"

    # API Keys
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

    # Paths
    LOGS_DIR = PROJECT_ROOT / "backend" / "logs"
    STATIC_FOLDER = PROJECT_ROOT / "frontend" / "static"
    TEMPLATE_FOLDER = PROJECT_ROOT / "frontend" / "templates"

    # Ensure required directories exist
    LOGS_DIR.mkdir(exist_ok=True)

    # Logging Configuration
    LOG_FORMAT = "[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    LOG_FILE = LOGS_DIR / "app.log"
    LOG_MAX_BYTES = 10240  # 10KB per file
    LOG_BACKUP_COUNT = 10  # Keep 10 backup files


# Create an instance of the config
config = Config()
