const userService = require('../services/user.service');

exports.createUser = (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return next({ status: 400, message: 'name and email are required' });
        }

        const user = userService.createUser({ name, email });
        res.status(201).json(user);

    } catch (err) {
        next(err);
    }
};

exports.getUsers = (req, res, next) => {
    try {
        const users = userService.getUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.getUserById = (req, res, next) => {
    try {
        const user = userService.getUserById(req.params.id);

        if (!user) {
            return next({ status: 404, message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.updateUser = (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return next({ status: 400, message: 'name and email are required' });
        }

        const updatedUser = userService.updateUser(req.params.id, { name, email });

        if (!updatedUser) {
            return next({ status: 404, message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = (req, res, next) => {
    try {
        const result = userService.deleteUser(req.params.id);

        if (result.changes === 0) {
            return next({ status: 404, message: 'User not found' });
        }

        res.json({ message: 'Deleted' });
    } catch (err) {
        next(err);
    }
};