import os
import base64
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pymongo
from bson import ObjectId
import bcrypt
import datetime
from schemas import *
from config import Settings

# SMTP configuration (use your email provider settings)
setting = Settings()

def hash_info(password: str, salt=None) -> str:
    salt = bcrypt.gensalt() if salt is None else salt.encode('utf-8')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return salt.decode('utf-8'), hashed_password.decode('utf-8')

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
    user_db = db.users
    user = await user_db.find_one({'email': email})
    if user:
        await user_db.update_one({'_id': user['_id']}, {'$set': {'password': code, 'created_at': datetime.datetime.now(), 'salt': salt, 'login_at': datetime.datetime.now()}})
        return True
    else:
        user_document = {
            "email": email,
            "salt": salt,
            "password": code,
            "created_at": datetime.datetime.now(),
            "user_type": "temp",
            "ip": "",
            "login_at": datetime.datetime.now(),
            "login": False,
        }
        await user_db.insert_one(user_document)
        return True

async def insert_formal_user(db, email, salt, password):
    user_db = db.users
    user = await user_db.find_one({"email": email})
    if user:
        user['password'] = password
        user['salt'] = salt
        user['created_at'] = datetime.datetime.now()
        await user_db.update_one({'_id': user['_id']}, 
                           {
                               '$set': {
                                   'password': password, 
                                   'created_at': datetime.datetime.now(), 
                                   'salt': salt, 
                                   'user_type': 'formal',
                                   'login_at': datetime.datetime.now(),
                                   'liked': []
                                }
                            })
        return True
    else:
        return

async def user_login(db, email, ip):
    user_db = db.users
    user = await user_db.find_one({"email": email})
    if user and user.get("user_type") == "formal":
        if user.get("login") is False:
            await user_db.update_one({'_id': user['_id']}, 
                               {
                                   '$set': {
                                       'login': True,
                                       'login_at': datetime.datetime.now(),
                                       'ip': ip,
                                   }
                                })
            return user['_id']
        else:
            if user.get('ip') != ip or (datetime.datetime.now() - user.get('login_at') > datetime.timedelta(hours=1)):
                await user_db.update_one({'_id': user['_id']},
                                   {
                                       '$set': {
                                           'login': False
                                       }
                                   })
                return
            await user_db.update_one({'_id': user['_id']}, {'$set': {'login_at': datetime.datetime.now()}})
            return user['_id']
    return

async def check_login_status(db, id, ip):
    user_db = db.users
    id = ObjectId(id)
    user = await user_db.find_one({'_id': id})
    if user and user.get("user_type") == "formal" and user.get("login") is True and datetime.datetime.now()-user.get("login_at") < datetime.timedelta(hours=3) and user.get("ip") == ip:
        await user_db.update_one({'_id': user['_id']}, {'$set': {'login_at': datetime.datetime.now()}})
        return True
    await user_db.update_one({'_id': user['_id']},
                        {
                            '$set': {
                                'login': False
                            }
                        })
    return False

def send_confirmation_email(email: str):
    code = ''.join(random.choices('0123456789', k=6))
    subject = "Email Confirmation Code"
    body = f"Your confirmation code is: {code}"
    
    # msg = MIMEMultipart()
    # msg['From'] = setting.SENDER_EMAIL
    # msg['To'] = email
    # msg['Subject'] = subject
    # msg.attach(MIMEText(body, 'plain'))
    msg = f"Subject:{subject}\n\n{body}"

    try:
        with smtplib.SMTP_SSL(setting.SMTP_SERVER, setting.SMTP_PORT) as server:
            # server.starttls()  # Secure the connection
            server.login(user=setting.SENDER_EMAIL, password=setting.SENDER_PASSWORD)
            server.sendmail(from_addr=setting.SENDER_EMAIL, to_addrs=email, msg=msg)
            print("Confirmation email sent successfully.")
        return code
    
    except Exception as e:
        print(f"Failed to send email: {str(e)}")