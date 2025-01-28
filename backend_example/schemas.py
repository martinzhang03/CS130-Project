from pydantic import BaseModel

class UserEmail(BaseModel):
    email: str

class UserConfirmation(BaseModel):
    email: str
    confirm_code: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
