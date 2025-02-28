CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    salt TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_type VARCHAR(20) DEFAULT 'formal',
    login_at TIMESTAMP,
    login BOOLEAN DEFAULT FALSE
);


CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    start_datetime TIMESTAMP,
    due_datetime TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,
    dependencies INTEGER[]
);

CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    task_id INT REFERENCES tasks(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, task_id)  -- Ensures a user can't be assigned the same task multiple times
);

INSERT INTO users (
    username,
    email,
    salt,
    password,
    user_type,
    login_at,
    login
) VALUES
('john_doe', 'john.doe@example.com', 'salt1', 'hashed_password1', 'temp', '192.168.1.1', '2025-02-17 14:00:00', true),
('jane_smith', 'jane.smith@example.com', 'salt2', 'hashed_password2', 'admin', '192.168.1.2', '2025-02-16 10:00:00', false),
('bob_jones', 'bob.jones@example.com', 'salt3', 'hashed_password3', 'temp', '192.168.1.3', '2025-02-18 09:30:00', true),
('alice_williams', 'alice.williams@example.com', 'salt4', 'hashed_password4', 'admin', '192.168.1.4', '2025-02-15 12:45:00', false);
