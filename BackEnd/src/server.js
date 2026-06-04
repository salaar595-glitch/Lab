require('./db/db');

const express = require('express');
const cors = require('cors');

const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');

const logger = require('./middleware/logger.middleware');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());
app.use(logger);

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/comments', commentRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found'
    });
});

app.use(errorMiddleware);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});