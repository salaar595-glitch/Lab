let posts = [];

exports.getAll = () => posts;

exports.getById = (id) => posts.find(p => p.id === id);

exports.create = (post) => {
    posts.push(post);
    return post;
};

exports.update = (id, data) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return null;

    posts[index] = { ...posts[index], ...data };
    return posts[index];
};

exports.delete = (id) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return false;

    posts.splice(index, 1);
    return true;
};