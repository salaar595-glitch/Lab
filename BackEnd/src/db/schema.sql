CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    name     TEXT    NOT NULL,
    email    TEXT    NOT NULL UNIQUE,
    password TEXT    NOT NULL,
    role     TEXT    NOT NULL DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS sessions (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    token  TEXT    NOT NULL UNIQUE,
    userId INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS posts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    body        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    author      TEXT    NOT NULL,
    ownerUserId INTEGER NOT NULL,
    createdAt   TEXT    DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ownerUserId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    text        TEXT    NOT NULL,
    author      TEXT,
    postId      INTEGER NOT NULL,
    ownerUserId INTEGER,
    FOREIGN KEY(postId) REFERENCES posts(id) ON DELETE CASCADE
);