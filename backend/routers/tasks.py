from datetime import datetime
import asyncpg
from fastapi import APIRouter, Depends, HTTPException, status
from crud import insert_assignments, insert_task, select_tasks_by_user, select_tasks_where_user, select_task_dependencies, select_task_by_task_id
from database import get_db
import schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

@router.post("/", response_model=schemas.TaskCreate, summary="Upload task to database")
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

@router.get("/", response_model=schemas.TaskUserMap, summary="Mapping of users to tasks")
async def get_task_mapping(db: asyncpg.Connection = Depends(get_db)):
    try:
        task_mapping = await select_tasks_by_user(db)
        return task_mapping
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

@router.get("/user_id/{user_id}", response_model=schemas.TaskUserMap, summary="Fetch all tasks assigned to a specific user")
async def get_user_tasks(user_id: int, db: asyncpg.Connection = Depends(get_db)):
    try:
        task_mapping = await select_tasks_where_user(db, user_id)
        return task_mapping
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

@router.delete("/user_id/{user_id}", response_model=schemas.TaskUserMap, summary="Delete user from all assigned tasks")
async def delete_user_from_tasks(user_id: int, db: asyncpg.Connection = Depends(get_db)):
    pass

@router.get("/task_id/{task_id}", summary="Fetch task by task id")
async def get_task_by_task_id(task_id: int, db:asyncpg.Connection = Depends(get_db)):
    try:
        task = await select_task_by_task_id(db, task_id)
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task
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

@router.get("/task_id/{task_id}", summary="Fetch dependencies by task id")
async def get_dependencies_by_task_id(task_id: int, db:asyncpg.Connection = Depends(get_db)):
    try:
        dependencies = await select_task_dependencies(db, task_id)
        if not dependencies:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="No dependencies found for this task"
            )
        return dependencies
    
    except asyncpg.PostgresError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Database error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="smth weird happened"
        )


@router.put("/task_id/{task_id}", summary="Edit task with given task id")
async def put_task_by_task_id(task_id: int, db:asyncpg.Connection = Depends(get_db)):
    pass

@router.delete("/task_id/{task_id}", summary="Delete task with given task id")
async def delete_task_by_task_id(task_id: int, db:asyncpg.Connection = Depends(get_db)):
    pass
