from pydantic import BaseModel, Field
from datetime import date, time
from typing import List, Optional

class TaskCreate(BaseModel):
    task_id: Optional[int] = Field(None, title="Task Id", description="The unique ID of the task is only in API responses")
    user_id: int = Field(..., title="User ID", description="The ID of the user assigned to the task")
    task_name: str = Field(..., title="Task Name", min_length=1, max_length=255)
    due_date: date = Field(..., title="Due Date")
    due_time: time = Field(..., title="Due Time")
    dependencies: List[int] = Field(default=[], title="Dependencies", description="List of dependent task IDs")
    assignees: List[int] = Field(default=[], title="Assignees", description="User IDs assigned to this task")
    description: str = Field(..., title="Description", max_length=1000)

class UserEmail(BaseModel):
    email: str

class UserConfirmation(BaseModel):
    email: str
    confirm_code: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
