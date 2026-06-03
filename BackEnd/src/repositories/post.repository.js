const db = require('../db/db');

exports.getAll = () => {
    return db.prepare(`SELECT * FROM posts ORDER BY id DESC`).all();
};

exports.getById = (id) => {
    return db.prepare(`SELECT * FROM posts WHERE id = ?`).get(id);
};

exports.create = (post) => {
    const result = db.prepare(`
        INSERT INTO posts (title, category, body, author)
        VALUES (?, ?, ?, ?)
    `).run(post.title, post.category, post.body, post.author);

    return { id: result.lastInsertRowid, ...post };
};

exports.update = (id, post) => {
    db.prepare(`
        UPDATE posts
        SET title = ?, category = ?, body = ?, author = ?
        WHERE id = ?
    `).run(post.title, post.category, post.body, post.author, id);

    return exports.getById(id);
};

exports.delete = (id) => {
    return db.prepare(`DELETE FROM posts WHERE id = ?`).run(id);
};