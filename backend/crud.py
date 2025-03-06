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
    SELECT id FROM users 
    WHERE email = $1 AND user_type = 'formal'
    """
    user = await db.fetchrow(query, email)
    
    if user:
        update_query = """
        UPDATE users 
        SET login = TRUE, login_at = $1
        WHERE id = $2
        """
        await db.execute(update_query, datetime.datetime.now(), user['id'])
        return user['id']
    
    return None

async def check_login_status(conn: asyncpg.Connection, id: str) -> bool:
    id = int(id)
    user = await conn.fetchrow("SELECT user_type, login, login_at FROM users WHERE id = $1", id)

    if user:
        login_at = user["login_at"]
        
        if login_at and isinstance(login_at, datetime.datetime):
            if user["user_type"] == "formal" and user["login"] and datetime.datetime.now() - login_at < datetime.timedelta(hours=3):
                await conn.execute("UPDATE users SET login_at = $1 WHERE id = $2", datetime.datetime.now(), id)
                return True
        
        await conn.execute("UPDATE users SET login = FALSE WHERE id = $1", id)
    
    return False

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
            dependencies,
            assignees
        ) VALUES (
            $1,$2,$3,$4,$5,$6
        ) RETURNING id
    """

    stmt = await db.prepare(query)
    return await stmt.fetchval(
            data.task_name,
            datetime.datetime.combine(data.start_date, data.start_time),
            datetime.datetime.combine(data.due_date, data.due_time),
            data.description,
            data.dependencies,
            data.assignees 
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
        assignees = row["assignees"],
        progress = row["progress"]
    )

def rows_to_taskusermap(rows: List[asyncpg.Record]) -> schemas.TaskUserMap:
    task_list = []  # Store tasks directly in a list
    
    for row in rows:
        task = db_task_to_taskfetch(row)  # Convert the row to TaskFetch format
        print(f"task is {task}")
        task_list.append(task)

    return schemas.TaskUserMap(status="success", user_tasks=task_list)


async def select_task_by_task_id(db: asyncpg.Connection, task_id: int) -> Optional[schemas.TaskFetch]:
    query = """
        SELECT id AS task_id, title, description, start_datetime, due_datetime, created_at, dependencies
        FROM tasks
        WHERE id = $1;
    """
    row = await db.fetchrow(query, task_id)
    
    if row:
        return db_task_to_taskfetch(row)
    return None

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
        SELECT 
            $1::INTEGER AS user_id,  -- Ensure $1 is treated as an integer
            t.id AS task_id, 
            t.title, 
            t.description, 
            t.start_datetime, 
            t.due_datetime, 
            t.created_at, 
            t.dependencies, 
            t.assignees,  
            t.progress    
        FROM tasks t
        WHERE $1::INTEGER = ANY(t.assignees)  -- Explicitly cast $1 to INTEGER
    """
    rows = await db.fetch(query, user_id)
    print(f"Result rows are {rows}")
    result = rows_to_taskusermap(rows)

    return result

async def update_task_progress(db: asyncpg.Connection, task_id: int) -> bool:
    query = """
    UPDATE tasks
    SET progress = 'Review'
    WHERE id = $1 AND progress = 'In Progress'
    RETURNING id;
    """
    result = await db.fetchval(query, task_id)
    return bool(result)
