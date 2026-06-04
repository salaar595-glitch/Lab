const db = require('../db/db');

module.exports = function authMiddleware(req, res, next) {
    const rawId = req.headers['x-demo-userid'];

    if (!rawId) {
        return res.status(401).json({ code: 401, message: 'Missing X-Demo-UserId header' });
    }

    const id = Number(rawId);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(401).json({ code: 401, message: 'Invalid X-Demo-UserId value' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!user) {
        return res.status(401).json({ code: 401, message: 'Unknown user' });
    }

    req.currentUserId = id;
    req.currentUser   = user;
    next();
};