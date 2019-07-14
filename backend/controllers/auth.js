const bcrypt = require('bcryptjs');

const {validationResult} = require('express-validator');

const User = require('../models/user');
const {throwError, sendError, clearImage} = require('../util/appUtil');

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const {email, name, password} = req.body;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password: hashedPassword,
                name
            });
            return user.save();
        })
        .then(result => res.status(201).json({message: 'user created', userId: result._id}))
        .catch(err => sendError(err, next, 500));
};

