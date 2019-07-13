const {validationResult} = require('express-validator');

const Post = require('../models/post');
const {throwError} = require('../util/appUtil');

exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: 123456789,
                title: 'First Post',
                content: 'This is the first post!',
                imageUrl: 'images/book.jpeg',
                creator: {
                    name: 'torikul alam'
                },
                createdAt: new Date()
            }
        ]
    });
};

exports.createPost = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) throwError('Validation failed, entered data is incorrect.', 422);
    const {title, content} = req.body;
    const post = new Post({
        title,
        content,
        imageUrl: 'images/book.jpeg',
        creator: {name: 'Torikul'}
    });
    post.save()
        .then(result => res.status(201).json({
                message: 'Post created successfully!',
                post: result
            })
        )
        .catch(err => {
            if (!err.statusCode) err.statusCode = 500;
            next(err);
        });
};
