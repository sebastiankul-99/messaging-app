CREATE TABLE users (
    id SERIAL PRIMARY KEY, 
    first_name varchar(40)  NOT NULL,
    last_name varchar(40)  NOT NULL,
    email varchar(40)  NOT NULL,
    hash_password text NOT NULL,
    salt text NOT NULL
);
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id int NOT NULL,
    refreshed_token varchar NOT NULL, 
    user_agent varchar  NOT NULL,
    client_ip varchar  NOT NULL,
    is_blocked boolean NOT NULL DEFAULT false,
    expires_at timestamptz NOT NULL, 
    created_at timestamptz NOT NULL DEFAULT (now())
);
ALTER TABLE sessions ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");