const db = require('../db/db');

exports.getAll = (callback) => {
    try {
        const rows = db.prepare(`SELECT * FROM comments`).all();
        callback(null, rows);
    } catch (err) {
        callback(err);
    }
};

exports.getById = (id, callback) => {
    try {
        const row = db
            .prepare(`SELECT * FROM comments WHERE id = ?`)
            .get(id);

        callback(null, row);
    } catch (err) {
        callback(err);
    }
};

exports.create = (comment, callback) => {
    try {
        const stmt = db.prepare(`
            INSERT INTO comments(text, author, postId)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(
            comment.text,
            comment.author,
            comment.postId
        );

        callback(null, {
            id: result.lastInsertRowid,
            ...comment
        });

    } catch (err) {
        callback(err);
    }
};

exports.update = (id, comment, callback) => {
    try {
        db.prepare(`
            UPDATE comments
            SET text = ?
            WHERE id = ?
        `).run(comment.text, id);

        callback(null);
    } catch (err) {
        callback(err);
    }
};

exports.delete = (id, callback) => {
    try {
        db.prepare(`
            DELETE FROM comments WHERE id = ?
        `).run(id);

        callback(null);
    } catch (err) {
        callback(err);
    }
};

exports.getByPostId = (postId) => {
    return db.prepare(`
        SELECT * FROM comments
        WHERE postId = ?
    `).all(postId);
};