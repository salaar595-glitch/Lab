let users = [];

exports.getAll = () => users;

exports.getById = (id) => users.find(u => u.id === id);

exports.create = (user) => {
    users.push(user);
    return user;
};

exports.update = (id, data) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { ...users[index], ...data };
    return users[index];
};

exports.delete = (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
};