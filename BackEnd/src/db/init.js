const fs = require('fs');
const path = require('path');
const db = require('./db');

const schema = fs.readFileSync(
    path.join(__dirname, 'schema.sql'),
    'utf-8'
);

db.exec(schema, (err) => {
    if (err) {
        console.log('Schema init error', err.message);
    } else {
        console.log('Schema initialized');
    }
});