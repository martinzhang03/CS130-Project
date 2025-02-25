from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import *
from database import *
from routers import tasks
from routers import users

app = FastAPI(lifespan=lifespan)

app.include_router(tasks.router, dependencies=[Depends(get_db)])
app.include_router(users.router, dependencies=[Depends(get_db)])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI with Postgres!"}
