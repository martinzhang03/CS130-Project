from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
import asyncpg
import os
from routers import tasks

DATABASE_URL = os.getenv("DATABASE_URL")

async def get_db():
    return db

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db
    db = await asyncpg.connect(DATABASE_URL)

    yield

    await db.close()

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router, dependencies=[Depends(get_db)])

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
