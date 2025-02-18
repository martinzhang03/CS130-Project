import asyncpg
import datetime
import random
import smtplib
from config import Settings
import bcrypt

setting = Settings()

def hash_info(password: str, salt=None) -> str:
    salt = bcrypt.gensalt() if salt is None else salt.encode('utf-8')
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return salt.decode('utf-8'), hashed_password.decode('utf-8')

def send_confirmation_email(email: str):
    code = ''.join(random.choices('0123456789', k=6))
    subject = "Email Confirmation Code"
    body = f"Your confirmation code is: {code}"
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


async def find_existing_user(db: asyncpg.Connection, key: str, query: str = "formal"):
    try:
        if query == "formal":
            user = await db.fetchrow("SELECT password, salt FROM users WHERE email = $1 AND user_type = 'formal'", key)
            if user:
                return True, user["password"], user["salt"]
            return False, "", ""

        elif query == "temp":
            user = await db.fetchrow(
                "SELECT password, salt, created_at FROM users WHERE email = $1 AND user_type = 'temp'", key
            )
            if user:
                create_time = user["created_at"]
                if datetime.datetime.now() - create_time > datetime.timedelta(hours=1):
                    return False, "", ""
                return True, user["password"], user["salt"]
            return False, "", ""

    except Exception as e:
        print(f"Database Error: {e}")
        return False, "", ""
    

async def insert_temp_user(db: asyncpg.Connection, email: str, salt: str, code: str) -> bool:
    """
    Inserts or updates a temporary user in the PostgreSQL database.
    """
    try:
        query = "SELECT id, user_type, password, salt, created_at FROM users WHERE email = $1 AND user_type = 'temp'"
        user = await db.fetchrow(query, email)

        if user:
            update_query = """
                UPDATE users 
                SET password = $1, created_at = $2, salt = $3, login_at = $4
                WHERE id = $5
            """
            await db.execute(update_query, code, datetime.datetime.now(), salt, datetime.datetime.now(), user['id'])
            return True
        else:
            insert_query = """
                INSERT INTO users (email, salt, password, created_at, user_type, login_at, login)
                VALUES ($1, $2, $3, $4, 'temp', $5, FALSE)
            """
            await db.execute(insert_query, email, salt, code, datetime.datetime.now(), datetime.datetime.now())
            return True

    except Exception as e:
        print(f"Error inserting/updating user: {e}")
        return False
    
async def user_login(db: asyncpg.Connection, email: str):
    query = """
    SELECT id, username, email, user_type, login, login_at, 
    FROM users 
    WHERE email = $1 AND user_type = 'formal'
    """
    user = await db.fetchrow(query, email)
    
    if user:
        if not user['login']:
            update_query = """
            UPDATE users 
            SET login = TRUE, login_at = $1,
            WHERE id = $2
            """
            await db.execute(update_query, datetime.datetime.now(), user['id'])
            return user['id']
        else:
            update_query = """
            UPDATE users 
            SET login = TRUE, login_at = $1, 
            WHERE id = $2
            """
            await db.execute(update_query, datetime.datetime.now(), user['id'])
            return user['id']
    return None