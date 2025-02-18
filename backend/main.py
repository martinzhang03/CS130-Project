from fastapi import FastAPI
from routers import tasks
from schemas import *
from database import *

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router)

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
