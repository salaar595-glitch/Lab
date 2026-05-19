require('./db/db');

const express = require('express');

const cors = require('cors');

const postRoutes = require('./routes/post.routes');

const userRoutes = require('./routes/user.routes');

const commentRoutes = require('./routes/comment.routes');

const logger = require('./middleware/logger.middleware');

const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(cors());

app.use(express.json());

app.use(logger);

app.use('/api/posts', postRoutes);

app.use('/api/users', userRoutes);

app.use('/api/comments', commentRoutes);

app.use(errorMiddleware);

app.listen(3000, () => {

    console.log('Server running on port 3000');
});