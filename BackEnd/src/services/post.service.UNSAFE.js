
const repo = require('../repositories/post.repository');

exports.updatePostUnsafe = (id, data) => {
    const existing = repo.getById(id);
    if (!existing) throw { status: 404, message: 'Post not found' };
    return repo.update(id, data);
};

exports.deletePostUnsafe = (id) => {
    const existing = repo.getById(id);
    if (!existing) throw { status: 404, message: 'Post not found' };
    return repo.delete(id);
};