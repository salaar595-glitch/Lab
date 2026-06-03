module.exports = (err, req, res, next) => {
    const status = err.status || 500;

    res.status(status).json({
        status:  status,
        title:   err.title   || httpTitle(status),
        detail:  err.message || 'Внутрішня помилка сервера',
        errors:  err.errors  || []
    });
};

function httpTitle(status) {
    const titles = {
        400: 'Bad Request',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error'
    };
    return titles[status] || 'Error';
}