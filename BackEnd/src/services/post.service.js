const repo = require('../repositories/post.repository');

exports.getPosts = () => {
    return { items: repo.getAll() };
};

exports.getPost = (id) => {
    const post = repo.getById(id);
    if (!post) throw { status: 404, message: 'Post not found' };
    return post;
};

exports.createPost = (data, currentUserId) => {
    const errors = validatePost(data);
    if (errors.length > 0) throw { status: 400, message: 'Validation failed', errors };

    return repo.create({
        title:       data.title,
        category:    data.category,
        body:        data.body,
        author:      data.author,
        ownerUserId: currentUserId
    });
};

exports.updatePost = (id, data, currentUserId) => {
    const existing = repo.getById(id);
    if (!existing) throw { status: 404, message: 'Post not found' };

    if (existing.ownerUserId !== currentUserId) {
        throw { status: 403, message: 'Forbidden: you do not own this post' };
    }

    const errors = validatePost(data);
    if (errors.length > 0) throw { status: 400, message: 'Validation failed', errors };

    return repo.update(id, data);
};

exports.deletePost = (id, currentUserId) => {
    const existing = repo.getById(id);
    if (!existing) throw { status: 404, message: 'Post not found' };

    if (existing.ownerUserId !== currentUserId) {
        throw { status: 403, message: 'Forbidden: you do not own this post' };
    }

    return repo.delete(id);
};

function validatePost(data) {
    const errors = [];
    if (!data.title)
        errors.push('title is required');
    else if (data.title.length < 3)
        errors.push('title must be at least 3 characters');
    else if (data.title.length > 100)
        errors.push('title must be at most 100 characters');

    if (!data.category)
        errors.push('category is required');

    if (!data.body)
        errors.push('body is required');
    else if (data.body.length < 5)
        errors.push('body must be at least 5 characters');
    else if (data.body.length > 1000)
        errors.push('body must be at most 1000 characters');

    if (!data.author)
        errors.push('author is required');
    else if (data.author.length < 2)
        errors.push('author must be at least 2 characters');
    else if (data.author.length > 50)
        errors.push('author must be at most 50 characters');

    return errors;
}