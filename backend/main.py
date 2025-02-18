from fastapi import Depends, FastAPI
from schemas import *
from database import *
from routers import tasks

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router, dependencies=[Depends(get_db)])

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
