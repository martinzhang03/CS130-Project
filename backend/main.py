from fastapi import Depends, FastAPI
from schemas import *
from database import *
from routers import tasks
from routers import users

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router, dependencies=[Depends(get_db)])
app.include_router(users.router, dependencies=[Depends(get_db)])

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
