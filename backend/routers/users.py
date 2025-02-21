from fastapi import APIRouter, Depends, HTTPException
import asyncpg
import datetime
from database import *
import schemas
import crud
import auth
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

@router.post("/register")
async def register_user(user: schemas.UserEmail, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, _, _ = await crud.find_existing_user(db, user.email, "formal")

        if existing_user:
            return {"status": "fail", "message": "Registration Failed: Existing User, please login or reset password."}

        # code = crud.send_confirmation_email(user.email)  
        salt, hashed_password = crud.hash_info(user.password)
        result = await crud.insert_temp_user(db, user.email, salt, hashed_password, user.user_name)

        if result is None or result is False:
            return {"status": "fail", "message": "Some Error Occurred, please try again"}
        
        logger.info("Attempting user login")
        user_id = await crud.user_login(db, user.email)
        if user_id is None: 
            return {"status": "fail", "message": "Some Error Occurred, please try again"}
        
        token = auth.generate_token(str(user_id))
        return {"status": "success", "message": "User Registered", "jwt_token": token}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    
@router.post("/login")
async def login_user(user: schemas.UserLogin, db: asyncpg.Connection = Depends(get_db)):
    try:
        existing_user, password, salt = await crud.find_existing_user(db, user.email, "formal")
        
        encrypt_code = crud.hash_info(user.password, salt)[1] if existing_user else ""
        if not existing_user or password != encrypt_code:
            return {"status": "fail", "message": "Email doesn't exist or incorrect password"}
        	
        user_id = await crud.user_login(db, user.email)
        if user_id is None: 
            return {"status": "fail", "message": "Email doesn't exist or incorrect password"}
            
        token = auth.generate_token(str(user_id))
        return {"status": "success", "message": "successfully logged in", "jwt_token": token}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))