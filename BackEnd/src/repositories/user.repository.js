let users = [];

exports.getAll = () => users;

exports.getById = (id) => users.find(u => u.id === id);

exports.create = (user) => {
    const newUser = {
        id: Date.now(),
        ...user
    };

    users.push(newUser);

    return newUser;
};

exports.update = (id, data) => {
    const index = users.findIndex(u => u.id === id);

    users[index] = {
        ...users[index],
        ...data
    };

    return users[index];
};

exports.delete = (id) => {
    users = users.filter(u => u.id !== id);
};