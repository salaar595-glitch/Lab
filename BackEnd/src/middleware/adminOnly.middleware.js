module.exports = function adminOnly(req, res, next) {
    if (!req.currentUser || req.currentUser.role !== 'admin') {
        return res.status(403).json({ code: 403, message: 'Admin access required' });
    }
    next();
};