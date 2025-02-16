from contextlib import asynccontextmanager
from fastapi import FastAPI
import asyncpg
import os
from routers import tasks

DATABASE_URL = os.getenv("DATABASE_URL")

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db
    db = await asyncpg.connect(DATABASE_URL)

    yield

    await db.close()

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router)

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
