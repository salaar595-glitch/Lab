const service = require('../services/post.service');

exports.getAll = (req, res, next) => {
    try {
        res.json(service.getPosts());
    } catch (e) { next(e); }
};

exports.getOne = (req, res, next) => {
    try {
        res.json(service.getPost(Number(req.params.id)));
    } catch (e) { next(e); }
};

exports.create = (req, res, next) => {
    try {
        const post = service.createPost(req.body, req.currentUserId);
        res.status(201).json(post);
    } catch (e) { next(e); }
};

exports.update = (req, res, next) => {
    try {
        const post = service.updatePost(
            Number(req.params.id),
            req.body,
            req.currentUserId
        );
        res.json(post);
    } catch (e) { next(e); }
};

exports.remove = (req, res, next) => {
    try {
        service.deletePost(Number(req.params.id), req.currentUserId);
        res.status(204).send();
    } catch (e) { next(e); }
};