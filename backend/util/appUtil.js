exports.throwError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};

exports.sendError = (err, next, statusCode) => {
    if (!err.statusCode) err.statusCode = statusCode;
    next(err);
}
