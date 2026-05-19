const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const db = require('./db/db');

const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');

const logger = require('./middleware/logger.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

const schema = fs.readFileSync(
    path.join(__dirname, './db/schema.sql'),
    'utf8'
);

db.exec(schema, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Schema initialized');
    }
});

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: {
            code: 'NOT_FOUND',
            message: 'Route not found'
        }
    });
});

app.use(errorMiddleware);

module.exports = app;