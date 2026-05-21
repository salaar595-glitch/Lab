const Database = require('better-sqlite3');

const db = new Database('./data/app.db');

db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    body TEXT NOT NULL,
    author TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    author TEXT NOT NULL,
    postId INTEGER NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(postId)
    REFERENCES posts(id)
    ON DELETE CASCADE
);
`);

console.log('SQLite connected');

module.exports = db;