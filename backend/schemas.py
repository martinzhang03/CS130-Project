from pydantic import BaseModel, Field
from datetime import date, time

class TaskCreate(BaseModel):
    user_id: int = Field(..., title="User ID", description="The ID of the user assigned to the task")
    task_id: int = Field(..., title="Task ID", description="Unique task identifier")
    task_title: str = Field(..., title="Task Name", min_length=1, max_length=255)
    task_date: date = Field(..., title="Task Date")

class UserEmail(BaseModel):
    email: str

class UserConfirmation(BaseModel):
    email: str
    confirm_code: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str