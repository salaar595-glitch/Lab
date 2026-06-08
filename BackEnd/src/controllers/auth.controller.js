const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db     = require('../db/db');

const SECRET     = process.env.JWT_SECRET || 'super-secret-lab-key';
const SALT_ROUNDS = 10;

exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next({ status: 400, message: 'name, email and password are required' });
        }

        if (password.length < 6) {
            return next({ status: 400, message: 'password must be at least 6 characters' });
        }

        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) {
            return next({ status: 409, message: 'Email already in use' });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const result = db.prepare(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
        ).run(name, email, hash, 'user');

        res.status(201).json({ id: result.lastInsertRowid, name, email, role: 'user' });

    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next({ status: 400, message: 'email and password are required' });
        }

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        // Однакове повідомлення — не розкриває чи існує email
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next({ status: 401, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            SECRET,
            { expiresIn: '2h' }
        );

        db.prepare('INSERT INTO sessions (token, userId) VALUES (?, ?)').run(token, user.id);

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res, next) => {
    try {
        db.prepare('DELETE FROM sessions WHERE token = ?').run(req.token);
        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        next(err);
    }
};