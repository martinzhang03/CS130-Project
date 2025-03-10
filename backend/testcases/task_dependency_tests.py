import pytest
from httpx import AsyncClient
from main import *


#test case #1 - returns fail when no dependencies
@pytest.mark.asyncio
async def test_no_dependency():
    async with AsyncClient(app=app, base_url="http://test") as client:
        #post a task with no dependency
        post_response = await client.post("/tasks/", json={
            "task_name": "1",
            "start_date": "2025-01-01",
            "start_time": "12:00:00",
            "due_date": "2025-01-02",
            "due_time": "12:00:00",
            "dependencies": [],
            "assignees": [1],
            "description": "This is a test task."
        })
        created_task = post_response.json()
        task_id = created_task["task_id"]
        
        #search for dependency of task
        get_response = await client.get(f"/tasks/task_id/{task_id}/dependencies")
    assert (post_response.status_code == 200) and (get_response.status_code == 200)
    
    #should send a failed status
    data = get_response.json()
    assert data["status"] == "fail"
    
    

#test case #2 - returns fail when no dependencies
@pytest.mark.asyncio
async def test_no_dependency():
    async with AsyncClient(app=app, base_url="http://test") as client:
        #post 3 tasks
        post1_response = await client.post("/tasks/", json={
            "task_name": "1",
            "start_date": "2025-01-01",
            "start_time": "12:00:00",
            "due_date": "2025-01-02",
            "due_time": "12:00:00",
            "dependencies": [],
            "assignees": [1],
            "description": "This is a test task."
        })
        assert post1_response.status_code == 200
        post1 = post1_response.json()
        post1_id = post1["task_id"]
        
        #dependent on task1
        post2_response = await client.post("/tasks/", json={
            "task_name": "2",
            "start_date": "2025-01-01",
            "start_time": "12:00:00",
            "due_date": "2025-01-02",
            "due_time": "12:00:00",
            "dependencies": [post1_id],
            "assignees": [1],
            "description": "This is a test task."
        })
        assert post2_response.status_code == 200
        post2 = post2_response.json()
        post2_id = post2["task_id"]
        
        #dependent on task1, task2
        post3_response = await client.post("/tasks/", json={
            "task_name": "2",
            "start_date": "2025-01-01",
            "start_time": "12:00:00",
            "due_date": "2025-01-02",
            "due_time": "12:00:00",
            "dependencies": [post1_id, post2_id],
            "assignees": [1],
            "description": "This is a test task."
        })
        assert post3_response.status_code == 200
        post3 = post3_response.json()
        post3_id = post3["task_id"]
        
        #get response for task3
        get_response = await client.get(get_response = await client.get(f"/tasks/task_id/{post3_id}/dependencies"))
        
    data = get_response.json()
    assert data["status"] == "success"
    assert list(data["dependencies"])[0] == post1_id
    assert list(data["dependencies"])[1] == post2_id
    
