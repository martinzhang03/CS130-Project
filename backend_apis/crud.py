import os
import base64
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pymongo
import datetime

async def find_existing_user(db, key, query: str ="formal"):
    # print(key, query)
    user_db = db.users
    
    if query == "formal":
        query_user = await user_db.find_one({"email": key})
        if query_user is not None and query_user.get("user_type") == "formal":
            pass_word = query_user.get("password")
            salt = query_user.get("salt")
            return True, pass_word, salt
        return False, "", ""
    
    elif query == "temp":
        query_user = await user_db.find_one({"email": key})
        if query_user is not None and query_user.get("user_type") == "temp":
            pass_word = query_user.get("password")
            salt = query_user.get("salt")
            create_time = query_user.get("created_at")
            if datetime.datetime.now() - create_time > datetime.timedelta(hours=1):
                return False, "", ""
            return True, pass_word, salt
        return False, "", ""
    
async def insert_temp_user(db, email, salt, code):
    pass


async def insert_formal_user(db, email, salt, password):
    pass


async def user_login(db, email, ip):
    pass


def send_confirmation_email(email: str):
    pass