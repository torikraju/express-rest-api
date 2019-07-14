const uuid = require('uuid');
const fs = require('fs');
const path = require('path');

exports.throwError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    throw error;
};

exports.sendError = (err, next, statusCode) => {
    if (!err.statusCode) err.statusCode = statusCode;
    next(err);
};

exports.getFileExtension = file => {
    const extArray = file.mimetype.split('/');
    return extArray[extArray.length - 1];
};

exports.getUUID = () => uuid.v1()
    .toString()
    .split('-')
    .join('');

exports.clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
