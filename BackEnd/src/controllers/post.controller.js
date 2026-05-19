const service = require('../services/post.service');

exports.getAll = (req, res, next) => {

    try {

        const posts = service.getPosts();

        res.json(posts);

    } catch (e) {

        next(e);
    }
};



exports.getOne = (req, res, next) => {

    try {

        const post = service.getPost(Number(req.params.id));

        res.json(post);

    } catch (e) {

        next(e);
    }
};



exports.create = (req, res, next) => {

    try {

        const post = service.createPost(req.body);

        res.status(201).json(post);

    } catch (e) {

        next(e);
    }
};



exports.update = (req, res, next) => {

    try {

        const post = service.updatePost(
            Number(req.params.id),
            req.body
        );

        res.json(post);

    } catch (e) {

        next(e);
    }
};



exports.remove = (req, res, next) => {

    try {

        service.deletePost(Number(req.params.id));

        res.status(204).send();

    } catch (e) {

        next(e);
    }
};