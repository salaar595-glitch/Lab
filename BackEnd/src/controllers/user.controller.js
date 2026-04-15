const service = require('../services/user.service');

exports.getAll = (req, res, next) => {
    try {
        res.json(service.getUsers());
    } catch (e) { next(e); }
};

exports.create = (req, res, next) => {
    try {
        res.status(201).json(service.createUser(req.body));
    } catch (e) { next(e); }
};