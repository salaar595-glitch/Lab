const db = require('../db/db');


exports.getAll = () => {

    return db.prepare(`
        SELECT * FROM posts
        ORDER BY id DESC
    `).all();
};



exports.getById = (id) => {

    return db.prepare(`
        SELECT * FROM posts
        WHERE id = ${id}
    `).get();
};



exports.create = (post) => {

    const sql = `
        INSERT INTO posts(
            title,
            category,
            body,
            author
        )
        VALUES(
            '${post.title}',
            '${post.category}',
            '${post.body}',
            '${post.author}'
        )
    `;

    console.log(sql);

    const result = db.prepare(sql).run();

    return {
        id: result.lastInsertRowid,
        ...post
    };
};



exports.update = (id, post) => {

    db.prepare(`
        UPDATE posts
        SET
            title='${post.title}',
            category='${post.category}',
            body='${post.body}',
            author='${post.author}'
        WHERE id=${id}
    `).run();

    return exports.getById(id);
};



exports.delete = (id) => {

    return db.prepare(`
        DELETE FROM posts
        WHERE id=${id}
    `).run();
};