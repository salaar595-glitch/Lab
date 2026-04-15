const repo = require('../repositories/post.repository');

exports.getPosts = () => {
    return { items: repo.getAll() };
};

exports.getPost = (id) => {
    const post = repo.getById(id);
    if (!post) throw { status: 404, message: "Post not found" };
    return post;
};

exports.createPost = (data) => {
    if (!data.title || !data.body) {
        throw {
            status: 400,
            code: "VALIDATION_ERROR",
            message: "Title and body required"
        };
    }

    const post = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString()
    };

    return repo.create(post);
};

exports.updatePost = (id, data) => {
    const updated = repo.update(id, data);
    if (!updated) throw { status: 404, message: "Post not found" };
    return updated;
};

exports.deletePost = (id) => {
    const ok = repo.delete(id);
    if (!ok) throw { status: 404, message: "Post not found" };
};