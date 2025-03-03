import pytest
import datetime
from collections import defaultdict
from backend.crud import (
    select_tasks_by_user,
    select_tasks_where_user,
    rows_to_taskusermap,
    db_task_to_taskfetch
)
import schemas

# Create a fake DB connection that simulates asyncpg.Connection
class FakeDB:
    def __init__(self, rows):
        self._rows = rows

    async def fetch(self, query, *args):
        # For testing, simply return our pre-defined rows.
        return self._rows

@pytest.fixture
def sample_rows():
    now = datetime.datetime.now()
    return [
        {
            "user_id": 1,
            "task_id": 1,
            "title": "Task 1",
            "description": "Description 1",
            "start_datetime": now,
            "due_datetime": now + datetime.timedelta(days=1),
            "created_at": now,
            "dependencies": []
        },
        {
            "user_id": 1,
            "task_id": 2,
            "title": "Task 2",
            "description": "Description 2",
            "start_datetime": now,
            "due_datetime": now + datetime.timedelta(days=2),
            "created_at": now,
            "dependencies": []
        },
        {
            "user_id": 2,
            "task_id": 3,
            "title": "Task 3",
            "description": "Description 3",
            "start_datetime": now,
            "due_datetime": now + datetime.timedelta(days=3),
            "created_at": now,
            "dependencies": []
        }
    ]

# Test Case 1: Valid Request with Existing Data
@pytest.mark.asyncio
async def test_select_tasks_by_user_with_data(sample_rows):
    fake_db = FakeDB(sample_rows)
    result = await select_tasks_by_user(fake_db)
    
    # Check that result is an instance of TaskUserMap and contains expected data.
    assert isinstance(result, schemas.TaskUserMap)
    # Verify that user 1 has two tasks and user 2 has one task.
    assert 1 in result.user_tasks
    assert 2 in result.user_tasks
    assert len(result.user_tasks[1]) == 2
    assert len(result.user_tasks[2]) == 1

# Test Case 2: Valid Request with No Data
@pytest.mark.asyncio
async def test_select_tasks_by_user_no_data():
    fake_db = FakeDB([])  # No rows in the database.
    result = await select_tasks_by_user(fake_db)
    # Expect the user_tasks mapping to be empty.
    assert isinstance(result, schemas.TaskUserMap)
    assert result.user_tasks == {}

# Test Case 3: Get Tasks for a Specific User
@pytest.mark.asyncio
async def test_select_tasks_where_user(sample_rows):
    fake_db = FakeDB(sample_rows)
    # Request tasks for user_id 1
    result = await select_tasks_where_user(fake_db, 1)
    # Expect user 1 to appear in the result with two tasks.
    assert 1 in result.user_tasks
    assert len(result.user_tasks[1]) == 2
    
    # Also test for a user_id that does not exist in the data.
    result_nonexistent = await select_tasks_where_user(fake_db, 99)
    # Expect an empty mapping if no tasks are found for user 99.
    assert result_nonexistent.user_tasks == {}
