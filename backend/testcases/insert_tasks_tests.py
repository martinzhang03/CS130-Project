import pytest
from httpx import AsyncClient
from main import app 


# Case 1: Simple successful task upload
@pytest.mark.asyncio
async def test_upload_task():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/tasks/", json={
            "task_name": "Test Task",
            "start_date": "2025-03-07",
            "start_time": "09:00:00",
            "due_date": "2025-03-10",
            "due_time": "17:00:00",
            "dependencies": [],
            "assignees": [1],  # At least one assignee is required
            "description": "This is a test task."
        })

    assert response.status_code == 200  # API should return success
    data = response.json()
    assert "task_id" in data  # Task ID should be generated
    assert data["task_name"] == "Test Task"
    assert data["description"] == "This is a test task."
    assert data["assignees"] == [1]  # Assignee should be present


# Case 2: Upload task w/o assignee (should fail)
@pytest.mark.asyncio
async def test_upload_task_without_assignee():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/tasks/", json={
            "task_name": "Task Without Assignee",
            "start_date": "2025-03-07",
            "start_time": "09:00:00",
            "due_date": "2025-03-10",
            "due_time": "17:00:00",
            "dependencies": [],
            "assignees": [],  # No assignee
            "description": "This task has no assignees."
        })

    assert response.status_code == 200  # API still returns 200, but with an error message
    data = response.json()
    assert data["status"] == "fail"
    assert data["message"] == "A task must have at least one assignee"
