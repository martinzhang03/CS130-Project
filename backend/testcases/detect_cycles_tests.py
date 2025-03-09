import pytest
from httpx import AsyncClient
from main import app


# Case 1: Test cycle detection when there are no cycles
@pytest.mark.asyncio
async def test_no_cycles():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/tasks/detect_cycles")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["message"] == "No cycles detected."


# Case 2: Test cycle detection when there is a single cycle
@pytest.mark.asyncio
async def test_single_cycle(setup_tasks):
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Manually insert a cycle: 1 → 2 → 3 → 1
        await client.post("/tasks/", json={"task_name": "Task 1", "dependencies": [], "assignees": [1], "description": "T1"})
        await client.post("/tasks/", json={"task_name": "Task 2", "dependencies": [1], "assignees": [1], "description": "T2"})
        await client.post("/tasks/", json={"task_name": "Task 3", "dependencies": [2], "assignees": [1], "description": "T3"})

        # Update Task 1 to depend on Task 3, completing the cycle
        await client.put("/tasks/task_id/1", json={"task_name": "Task 1", "dependencies": [3], "assignees": [1], "description": "Updated T1"})

        response = await client.get("/tasks/detect_cycles")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "cycles" in data
    assert [1, 2, 3, 1] in data["cycles"]  # Check detected cycle


# Case 3: Test cycle detection when there are multiple cycles
@pytest.mark.asyncio
async def test_multiple_cycles(setup_tasks):
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Insert multiple cycles:
        # Cycle A: 1 → 2 → 3 → 1
        # Cycle B: 4 → 5 → 4
        # Cycle C: 6 → 7 → 8 → 6
        await client.post("/tasks/", json={"task_name": "Task 1", "dependencies": [], "assignees": [1], "description": "T1"})
        await client.post("/tasks/", json={"task_name": "Task 2", "dependencies": [1], "assignees": [1], "description": "T2"})
        await client.post("/tasks/", json={"task_name": "Task 3", "dependencies": [2], "assignees": [1], "description": "T3"})
        await client.put("/tasks/task_id/1", json={"task_name": "Task 1", "dependencies": [3], "assignees": [1], "description": "Updated T1"})

        await client.post("/tasks/", json={"task_name": "Task 4", "dependencies": [], "assignees": [1], "description": "T4"})
        await client.post("/tasks/", json={"task_name": "Task 5", "dependencies": [4], "assignees": [1], "description": "T5"})
        await client.put("/tasks/task_id/4", json={"task_name": "Task 4", "dependencies": [5], "assignees": [1], "description": "Updated T4"})

        await client.post("/tasks/", json={"task_name": "Task 6", "dependencies": [], "assignees": [1], "description": "T6"})
        await client.post("/tasks/", json={"task_name": "Task 7", "dependencies": [6], "assignees": [1], "description": "T7"})
        await client.post("/tasks/", json={"task_name": "Task 8", "dependencies": [7], "assignees": [1], "description": "T8"})
        await client.put("/tasks/task_id/6", json={"task_name": "Task 6", "dependencies": [8], "assignees": [1], "description": "Updated T6"})

        response = await client.get("/tasks/detect_cycles")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "fail"
    assert "cycles" in data
    assert [1, 2, 3, 1] in data["cycles"]  # Cycle A
    assert [4, 5, 4] in data["cycles"]      # Cycle B
    assert [6, 7, 8, 6] in data["cycles"]   # Cycle C
