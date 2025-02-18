from datetime import datetime
import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status
from crud import insert_assignments, insert_task
from database import get_db
import schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@router.get("/{user_id}")
async def get_user_tasks(user_id: str):
    return {"uid": user_id}

# Create a task
@router.post("/", response_model=schemas.TaskCreate)
async def create_task(data: schemas.TaskCreate, db: asyncpg.Connection = Depends(get_db)):
    """
    Creates a new task and assigns it to a user.
    """
    # TODO: Validate user_id at the start
    try:
        async with db.transaction():
            id = await insert_task(db, data)
            if id is None:
                raise Exception("Failed to insert task into database")
            await insert_assignments(db, data, id)

        data.task_id = id
        return data
    except asyncpg.PostgresError as e:
        # Handle database-specific errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        # Catch any other unexpected exceptions
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An error occurred: {str(e)}"
        )
