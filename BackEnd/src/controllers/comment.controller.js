const service = require('../services/comment.service');

exports.getAll = (req, res, next) => {
    service.getComments((err, data) => {
        if (err) return next(err);

                res.json({
                    items: data
                });
            });
};

exports.getOne = (req, res, next) => {
    service.getComment(req.params.id, (err, data) => {
        if (err) return next(err);

        res.json(data);
    });
};

exports.create = (req, res, next) => {
    service.createComment(req.body, (err, data) => {
        if (err) return next(err);

        res.status(201).json(data);
    });
};

exports.update = (req, res, next) => {
    service.updateComment(req.params.id, req.body, (err, data) => {
        if (err) return next(err);

        res.json(data);
    });
};

exports.remove = (req, res, next) => {
    service.deleteComment(req.params.id, (err) => {
        if (err) return next(err);

        res.status(204).send();
    });
};

exports.getByPostId = (req, res, next) => {
    try {
        const comments = service.getByPostId(req.params.id);

        res.json({
            items: comments
        });

    } catch (e) {
        next(e);
    }
};