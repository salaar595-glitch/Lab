const express = require('express');
const cors = require('cors');

const postRoutes = require('./routes/post.routes');
const userRoutes = require('./routes/user.routes');
const errorMiddleware = require('./middleware/error.middleware');
const logger = require('./middleware/logger.middleware');

const app = express();

app.use(cors()); // ← ВАЖНО (чтобы фронт работал)
app.use(express.json());
app.use(logger);

app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: {
            code: "NOT_FOUND",
            message: "Route not found"
        }
    });
});

app.use(errorMiddleware);

module.exports = app;