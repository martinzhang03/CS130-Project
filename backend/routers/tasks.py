from datetime import datetime
import asyncpg
from fastapi import APIRouter, Depends, HTTPException
import schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

async def get_db():
    from main import db
    return db

@router.get("/{user_id}")
async def get_user_tasks(user_id: str):
    return {"uid": user_id}

# Create a task
@router.post("/", response_model=schemas.TaskCreate)
async def create_task(data: schemas.TaskCreate, db: asyncpg.Connection = Depends(get_db)):
    """
    Creates a new task and assigns it to a user.
    """
<<<<<<< HEAD
    # TODO: Validate user_id at the start

    async with db.transaction():
        query = """
            INSERT INTO tasks (
                title,
                due_datetime,
                description,
                dependencies
            ) VALUES (
                $1,$2,$3,$4
            ) RETURNING id
        """

        stmt = await db.prepare(query)
        id = await stmt.fetchval(
                data.task_name,
                datetime.combine(data.due_date, data.due_time),
                data.description,
                data.dependencies 
            )

        query = """
            INSERT INTO assignments (
                user_id, task_id
            ) VALUES (
                $1,$2
            )
        """

        stmt = await db.prepare(query)
        await stmt.executemany(zip(data.assignees, [id]*len(data.assignees)))

    data.task_id = id
    return data
=======
    # CRUD function for database operations
    return True

>>>>>>> 2599cfc2c49c06c300ec846803acb3a9025103a5
