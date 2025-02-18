import asyncpg
import os
from fastapi import Depends
from contextlib import asynccontextmanager
from config import Settings

setting = Settings()

DATABASE_URL = os.getenv(setting.DB_URL)

db = None

@asynccontextmanager
async def lifespan(app):
    global db
    db = await asyncpg.connect(DATABASE_URL)
    yield
    await db.close()

async def get_db():
    return db
