
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'v_rabote',
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(255),
    created_at BIGINT NOT NULL
);

CREATE INDEX idx_user_tasks ON tasks(user_id);
