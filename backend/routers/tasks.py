from datetime import datetime
import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status
from crud import insert_assignments, insert_task, group_tasks_by_members
from database import get_db
import schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@router.get("/{user_id}")
async def get_user_tasks(user_id: str):
    return {"uid": user_id}

@router.post("/", response_model=schemas.TaskCreate)
async def create_task(data: schemas.TaskCreate, db: asyncpg.Connection = Depends(get_db)):
    try:
        async with db.transaction():
            task_id = await insert_task(db, data)
            if task_id is None:
                raise Exception("Failed to insert task into database")
            await insert_assignments(db, data, task_id)

        data.task_id = task_id
        return data
    except asyncpg.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An error occurred: {str(e)}"
        )

@router.get("/group-by-members", summary="Tasks grouped by member")
async def get_tasks_grouped_by_members(db: asyncpg.Connection = Depends(get_db)):
    grouped_tasks = await group_tasks_by_members(db)
    return grouped_tasks
