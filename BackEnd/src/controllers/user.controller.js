const service = require('../services/user.service');

exports.getAll = (req, res, next) => {
    try {
        res.json(service.getUsers());
    } catch (err) {
        next(err);
    }
};

exports.getOne = (req, res, next) => {
    try {
        res.json(service.getUser(req.params.id));
    } catch (err) {
        next(err);
    }
};

exports.create = (req, res, next) => {
    try {
        const user = service.createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

exports.update = (req, res, next) => {
    try {
        res.json(service.updateUser(req.params.id, req.body));
    } catch (err) {
        next(err);
    }
};

exports.remove = (req, res, next) => {
    try {
        service.deleteUser(req.params.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};