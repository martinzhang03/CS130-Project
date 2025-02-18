from pydantic_settings import BaseSettings
from pathlib import Path

def load_key_from_file(file_path: str, field_name: str) -> str:
    """Helper method to read the key from the PEM file."""
    try:
        key_path = Path(file_path)
        with key_path.open('rb') as key_file:
            return key_file.read().decode('utf-8')
    except Exception as e:
        raise ValueError(f"Error reading the key file {file_path}: {e}")
    
class Settings(BaseSettings):
    PROJECT_NAME: str = 'TaskFlow'
    HOST: str = 'http://127.0.0.1'
    DB_URL: str = "DATABASE_URL"
    JWT_EXPIRE_SECONDS: int = 60*60*8
    # JWT_PUBLIC_KEY: str = load_key_from_file(r"public_key.pem", 'JWT_PUBLIC_KEY')
    # JWT_PRIVATE_KEY: str = load_key_from_file(r"private_key.pem", 'JWT_PRIVATE_KEY')

    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 465
    SENDER_EMAIL: str = "martinzhang0314@gmail.com"
    SENDER_PASSWORD: str = "SOME_PASSWORD"
