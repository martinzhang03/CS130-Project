from pydantic import BaseModel, Field
from datetime import date, datetime, time
from typing import Dict, List, Optional

class TaskCreate(BaseModel):
    task_id: Optional[int] = Field(None, title="Task Id", description="The unique ID of the task is only in API responses")
    task_name: str = Field(..., title="Task Name", min_length=1, max_length=255)
    start_date: date = Field(..., title="Start Date")
    start_time: time = Field(..., title="Start Time")
    due_date: date = Field(..., title="Due Date")
    due_time: time = Field(..., title="Due Time")
    dependencies: List[int] = Field(default=[], title="Dependencies", description="List of dependent task IDs")
    assignees: List[int] = Field(default=[], title="Assignees", description="User IDs assigned to this task")
    description: str = Field(..., title="Description", max_length=1000)

class TaskFetch(BaseModel):
    task_id: int = Field(..., title="Task Id", description="The unique ID of the task is only in API responses")
    task_name: str = Field(..., title="Task Name", min_length=1, max_length=255)
    start_datetime: datetime = Field(..., title="Start Datetime")
    due_datetime: datetime = Field(..., title="Due Datetime")
    created_at: datetime = Field(..., title="Creation Datetime")
    dependencies: List[int] = Field(default=[], title="Dependencies", description="List of dependent task IDs")
    assignees: List[int] = Field(default=[], title="Assignees", description="User IDs assigned to this task")
    description: str = Field(..., title="Description", max_length=1000)

class TaskUserMap(BaseModel):
    user_tasks: Dict[int, List[TaskFetch]] = Field(..., title="User Task Map", description="Mapping of user IDs to their assigned tasks")

class UserEmail(BaseModel):
    first_name: str
    user_name: str
    email: str
    password: str
    

class UserConfirmation(BaseModel):
    email: str
    confirm_code: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
