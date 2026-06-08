const jwt = require('jsonwebtoken');
const db  = require('../db/db');

const SECRET = process.env.JWT_SECRET || 'super-secret-lab-key';

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ code: 401, message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.slice(7);

    let payload;
    try {
        payload = jwt.verify(token, SECRET);
    } catch (err) {
        return res.status(401).json({ code: 401, message: 'Invalid or expired token' });
    }

    const session = db.prepare('SELECT id FROM sessions WHERE token = ?').get(token);
    if (!session) {
        return res.status(401).json({ code: 401, message: 'Token has been revoked' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.userId);
    if (!user) {
        return res.status(401).json({ code: 401, message: 'User not found' });
    }

    req.currentUserId = user.id;
    req.currentUser   = user;
    req.token         = token;
    next();
};