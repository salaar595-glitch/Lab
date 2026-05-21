const repo = require('../repositories/post.repository');

exports.getPosts = () => {

    return {
        items: repo.getAll()
    };
};



exports.getPost = (id) => {

    const post = repo.getById(id);

    if (!post) {

        throw {
            status: 404,
            message: 'Post not found'
        };
    }

    return post;
};



exports.createPost = (data) => {

    if (
        !data.title ||
        !data.category ||
        !data.body ||
        !data.author
    ) {

        throw {
            status: 400,
            message: 'All fields required'
        };
    }

    return repo.create(data);
};



exports.updatePost = (id, data) => {

    return repo.update(id, data);
};



exports.deletePost = (id) => {

    return repo.delete(id);
};