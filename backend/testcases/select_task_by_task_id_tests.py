import pytest
from httpx import AsyncClient
from main import app

# Case 1: Test fetching a task that exists
@pytest.mark.asyncio
async def test_fetch_existing_task():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # First, create a new task
        create_response = await client.post("/tasks/", json={
            "task_name": "Test Task",
            "start_date": "2025-03-07",
            "start_time": "09:00:00",
            "due_date": "2025-03-10",
            "due_time": "17:00:00",
            "dependencies": [],
            "assignees": [1],
            "description": "This is a test task.",
            "progress": "In Progress",
            "percentage": 0
        })

        assert create_response.status_code == 200  # Ensure task creation succeeds
        created_task = create_response.json()
        task_id = created_task["task_id"]

        # Now, fetch the task by ID
        response = await client.get(f"/tasks/task_id/{task_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["task_id"] == task_id
    assert data["task_name"] == "Test Task"
    assert data["description"] == "This is a test task."
    assert data["progress"] == "In Progress"
    assert data["percentage"] == 0


# Case 2: Test fetching a task that does not exist
@pytest.mark.asyncio
async def test_fetch_non_existing_task():
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/tasks/task_id/99999")  # (random arb. high id that doesn't exist)

    assert response.status_code == 200  # API still returns 200, but with an error message
    data = response.json()
    assert data["status"] == "fail"
    assert data["message"] == "Task not found"
