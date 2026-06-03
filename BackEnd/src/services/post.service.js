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
    const errors = validatePost(data);
    if (errors.length > 0) {
        throw {
            status: 400,
            message: 'Validation failed',
            errors
        };
    }

    const author = data.authorId || data.author;

    return repo.create({
        ...data,
        authorId: author
    });
};

exports.updatePost = (id, data) => {
    const existing = repo.getById(id);
    if (!existing) {
        throw {
            status: 404,
            message: 'Post not found'
        };
    }

    const errors = validatePost(data);
    if (errors.length > 0) {
        throw {
            status: 400,
            message: 'Validation failed',
            errors
        };
    }

    return repo.update(id, data);
};

exports.deletePost = (id) => {
    const existing = repo.getById(id);
    if (!existing) {
        throw {
            status: 404,
            message: 'Post not found'
        };
    }
    return repo.delete(id);
};

function validatePost(data) {
    const errors = [];
    const author = data.authorId || data.author;

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

    if (!author)
        errors.push('author is required');
    else if (String(author).length < 2)
        errors.push('author must be at least 2 characters');
    else if (String(author).length > 50)
        errors.push('author must be at most 50 characters');

    return errors;
}