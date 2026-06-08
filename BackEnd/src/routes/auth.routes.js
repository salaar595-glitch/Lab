const express     = require('express');
const router      = express.Router();
const rateLimit   = require('express-rate-limit');
const authCtrl    = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { code: 429, message: 'Too many login attempts, try again in 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false
});

router.post('/register', authCtrl.register);
router.post('/login',    loginLimiter, authCtrl.login);
router.post('/logout',   authMiddleware, authCtrl.logout);

module.exports = router;