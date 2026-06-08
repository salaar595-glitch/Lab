const db = require('../db/db');

module.exports = function checkOwner(table) {
    return function (req, res, next) {
        const id  = Number(req.params.id);
        const row = db.prepare(`SELECT ownerUserId FROM ${table} WHERE id = ?`).get(id);

        if (!row) {
            return res.status(404).json({ code: 404, message: 'Not found' });
        }

        if (row.ownerUserId !== req.currentUserId) {
            return res.status(403).json({ code: 403, message: 'Forbidden: you do not own this resource' });
        }

        next();
    };
};