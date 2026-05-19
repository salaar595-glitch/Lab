const repo = require('../repositories/comment.repository');

exports.getComments = (callback) => {
    repo.getAll(callback);
};

exports.getComment = (id, callback) => {
    repo.getById(id, callback);
};

exports.createComment = (data, callback) => {
    if (!data.text || !data.postId || !data.author) {
        return callback({
            status: 400,
            message: 'Validation error'
        });
    }

    repo.create(data, callback);
};

exports.updateComment = (id, data, callback) => {
    repo.update(id, data, callback);
};

exports.deleteComment = (id, callback) => {
    repo.delete(id, callback);
};

exports.getByPostId = (postId) => {
    return repo.getByPostId(postId);
};