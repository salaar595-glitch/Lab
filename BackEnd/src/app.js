const express = require('express');
const cors    = require('cors');

const postRoutes    = require('./routes/post.routes');
const userRoutes    = require('./routes/user.routes');
const commentRoutes = require('./routes/comment.routes');
const authRoutes    = require('./routes/auth.routes');

const logger          = require('./middleware/logger.middleware');
const errorMiddleware = require('./middleware/error.middleware');
const authMiddleware  = require('./middleware/auth.middleware');

const app = express();

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.removeHeader('X-Powered-By');
    next();
});

app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(logger);


app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/posts',    authMiddleware, postRoutes);
app.use('/api/v1/comments', authMiddleware, commentRoutes);
app.use('/api/v1/users',    userRoutes);

app.use((req, res) => {
    res.status(404).json({ code: 404, message: 'Route not found' });
});

app.use(errorMiddleware);

module.exports = app;