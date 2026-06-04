

const db = require('../db/db');


exports.searchUnsafe = (title) => {
    const query = `SELECT * FROM posts WHERE title = '${title}'`;
    console.log('[UNSAFE SQL]', query);
    return db.prepare(query).all();
};

