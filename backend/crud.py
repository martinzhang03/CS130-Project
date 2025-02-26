from collections import defaultdict
from typing import List, Optional, Tuple
import asyncpg
import datetime
import random
import smtplib
from config import Settings
import bcrypt
import schemas

setting = Settings()

def hash_info(password: str, salt=None) -> Tuple[str, str]:
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
    

async def insert_temp_user(db: asyncpg.Connection, email: str, salt: str, code: str, username: str) -> bool:
    """
    Inserts or updates a temporary user in the PostgreSQL database.
    """
    try:
        # query = "SELECT id, user_type, password, salt, created_at FROM users WHERE email = $1 AND user_type = 'formal'"
#         user = await db.fetchrow(query, email)
        insert_query = """
            INSERT INTO users (email, salt, password, created_at, user_type, login_at, login, username)
            VALUES ($1, $2, $3, $4, 'formal', $5, TRUE, $6)
        """
        await db.execute(insert_query, email, salt, code, datetime.datetime.now(), datetime.datetime.now(), username)
        return True

    except Exception as e:
        print(f"Error inserting/updating user: {e}")
        return False
    
async def user_login(db: asyncpg.Connection, email: str):
    query = """
    SELECT id, username, email, user_type, login, login_at
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

async def insert_task(db: asyncpg.Connection, data: schemas.TaskCreate) -> Optional[int]:
    """
    Creates task and returns id
    """
    query = """
        INSERT INTO tasks (
            title,
            start_datetime,
            due_datetime,
            description,
            dependencies
        ) VALUES (
            $1,$2,$3,$4,$5
        ) RETURNING id
    """

    stmt = await db.prepare(query)
    return await stmt.fetchval(
            data.task_name,
            datetime.datetime.combine(data.start_date, data.start_time),
            datetime.datetime.combine(data.due_date, data.due_time),
            data.description,
            data.dependencies 
            )

async def insert_assignments(db: asyncpg.Connection, data: schemas.TaskCreate, id: int) -> Optional[int]:
    query = """
        INSERT INTO assignments (
            user_id, task_id
        ) VALUES (
            $1,$2
        )
    """

    stmt = await db.prepare(query)
    await stmt.executemany(zip(data.assignees, [id]*len(data.assignees)))

def db_task_to_taskfetch(row: asyncpg.Record) -> schemas.TaskFetch:
    return schemas.TaskFetch(
        task_id = row["task_id"],
        task_name = row["title"],
        description = row["description"],
        start_datetime = row["start_datetime"],
        due_datetime = row["due_datetime"],
        created_at = row["created_at"],
        dependencies = row["dependencies"],
    )

def rows_to_taskusermap(rows: List[asyncpg.Record]) -> schemas.TaskUserMap:
    task_mapping = defaultdict(list)
    for row in rows:
        user_id = row["user_id"]
        task = db_task_to_taskfetch(row)
        task_mapping[user_id].append(task)

    return schemas.TaskUserMap(user_tasks = task_mapping) 

async def select_task_dependencies(db: asyncpg.Connection, task_id: int) -> List[schemas.TaskFetch]:
    query = """
        SELECT id AS task_id, title, description, start_datetime, due_datetime, created_at, dependencies
        FROM tasks
        WHERE dependencies @> ARRAY[$1]::integer[];
    """
    rows = await db.fetch(query, task_id)
    
    return [db_task_to_taskfetch(row) for row in rows]

async def select_tasks_by_user(db: asyncpg.Connection) -> schemas.TaskUserMap:
    query = """
        SELECT a.user_id, t.id AS task_id, t.title, t.description, t.start_datetime, t.due_datetime, t.created_at, t.dependencies
        FROM tasks t
        JOIN assignments a ON t.id = a.task_id
        ORDER BY a.user_id;
    """
    rows = await db.fetch(query)
    result = rows_to_taskusermap(rows)

    return result

async def select_tasks_where_user(db: asyncpg.Connection, user_id: int) -> schemas.TaskUserMap:
    query = """
        SELECT a.user_id, t.id AS task_id, t.title, t.description, t.start_datetime, t.due_datetime, t.created_at, t.dependencies
        FROM tasks t
        JOIN assignments a ON t.id = a.task_id
        WHERE a.user_id = $1
    """
    rows = await db.fetch(query, user_id)
    result = rows_to_taskusermap(rows)

    return result
