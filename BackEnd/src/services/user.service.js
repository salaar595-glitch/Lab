const repo = require('../repositories/user.repository');

exports.getUsers = () => {
    return { items: repo.getAll() };
};

exports.createUser = (data) => {
    if (!data.name || !data.email) {
        throw {
            status: 400,
            code: "VALIDATION_ERROR",
            message: "Name and email required"
        };
    }

    return repo.create({
        id: Date.now(),
        ...data
    });
};