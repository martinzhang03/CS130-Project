from fastapi import Depends, HTTPException, APIRouter, Request, FastAPI
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from pymongo import MongoClient
from pymongo.database import Database
import crud
from auth import *
from schemas import *
import database
import datetime

app = FastAPI()
# router = APIRouter()
security = HTTPBearer()

# MongoDB connection


@app.post("/api/user/register")
async def register_user(user: UserEmail, db: Database = Depends(database.get_db)):
    try:
        existing_user, _, _ = await crud.find_existing_user(db, user.email, "formal")
        if existing_user:
            raise HTTPException(
                status_code=401,
                detail="Registration Failed: Existing User, please login or reset password.",
            )

        code = crud.send_confirmation_email(user.email)
        # code = "000000"
        salt, hashed_password = crud.hash_info(code)
        # print(hashed_password)
        result = await crud.insert_temp_user(db, user.email, salt, hashed_password)
        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Some Error Occurred, please try again",
            )
        return {"status": "success", "message": "sent confirmation email"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.post("/api/user/confirm")
async def confirm_user(user: UserConfirmation, db: Database = Depends(database.get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "temp")
        encrypt_code = crud.hash_info(user.confirm_code, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            raise HTTPException(
                status_code=401,
                detail="Email doesn't exist or invalid confirm code",
            )
        salt, password = crud.hash_info(user.password)
        result = await crud.insert_formal_user(db, user.email, salt, password)
        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Some Error Occurred, please try again",
            )
        
        return {"status": "success", "message": "code confirmed"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/user/login")
async def login_user(user: UserLogin, request: Request, db: Database = Depends(database.get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "formal")
        encrypt_code = crud.hash_info(user.password, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            raise HTTPException(
                status_code=401,
                detail="Email doesn't exist or incorrect password",
            )
        user_ip = request.client.host
        user_id = await crud.user_login(db, user.email, user_ip)
        if user_id is None: 
            raise HTTPException(
                status_code=500,
                detail="Some error occured, please log in again",
            )
        
        token = generate_token((str(user_id)))
        return {"status": "success", "message": "successfully logged in", "jwt_token": token}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/user/reset/code")
async def reset_code(user: UserEmail, db: Database = Depends(database.get_db)):
    try:
        existing_user, _, _ = await crud.find_existing_user(db, user.email, "formal")
        if not existing_user:
            raise HTTPException(
                status_code=401,
                detail="Email doesn't exist, please register first.",
            )

        code = crud.send_confirmation_email(user.email)
        # code = "000000"
        salt, hashed_password = crud.hash_info(code)
        # print(hashed_password)
        result = await crud.insert_temp_user(db, user.email, salt, hashed_password)
        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Some Error Occurred, please try again",
            )
        return {"status": "success", "message": "sent confirmation email"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/user/reset/confirm")
async def reset_confirm(user: UserConfirmation, request: Request, db: Database = Depends(database.get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "formal")
        encrypt_code = crud.hash_info(user.confirm_code, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            raise HTTPException(
                status_code=401,
                detail="Email doesn't exist or invalid confirm code",
            )
        salt, password = crud.hash_info(user.password)
        result = await crud.insert_formal_user(db, user.email, salt, password)
        if result is None:
            raise HTTPException(
                status_code=500,
                detail="Some Error Occurred, please try again",
            )
        
        user_ip = request.client.host
        user_id = await crud.user_login(db, user.email, user_ip)
        if user_id is None: 
            raise HTTPException(
                status_code=500,
                detail="Some error occured, please log in again",
            )
        
        token = generate_token((str(user_id)))
        return {"status": "success", "message": "password reset successfully", "jwt_token": token}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
