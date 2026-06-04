module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    const isProd = process.env.NODE_ENV === 'production';

    res.status(status).json({
        code:    status,
        message: err.message || httpTitle(status),
        ...(isProd ? {} : { detail: err.stack })
    });
};

function httpTitle(status) {
    const titles = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        422: 'Unprocessable Entity',
        500: 'Internal Server Error'
    };
    return titles[status] || 'Error';
}