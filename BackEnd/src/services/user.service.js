const repo = require('../repositories/user.repository');

exports.getUsers = () => {
    return repo.getAll();
};

exports.getUser = (id) => {
    const user = repo.getById(Number(id));

    if (!user) {
        throw {
            status: 404,
            message: 'User not found'
        };
    }

    return user;
};

exports.createUser = (data) => {
    if (!data.name || !data.email) {
        throw {
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Name and email required'
        };
    }

    return repo.create(data);
};

exports.updateUser = (id, data) => {
    return repo.update(Number(id), data);
};

exports.deleteUser = (id) => {
    return repo.delete(Number(id));
};