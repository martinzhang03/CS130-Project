from fastapi import FastAPI
import asyncpg
import os

app = FastAPI()

DATABASE_URL = os.getenv("DATABASE_URL")

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}

@app.on_event("startup")
async def startup():
    global db
    db = await asyncpg.connect(DATABASE_URL)

@app.on_event("shutdown")
async def shutdown():
    await db.close()
