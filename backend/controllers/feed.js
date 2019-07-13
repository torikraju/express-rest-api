const {validationResult} = require('express-validator');

const Post = require('../models/post');

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
    const {title, content} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Validation failed, entered data is incorrect',
            errors: errors.array()
        });
    }

    const post = new Post({
        title,
        content,
        creator: {name: 'torikul'},
        imageUrl: 'images/book.jpeg',
    });
    post.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Post created successfully!',
                post: result
            });
        })
        .catch(e => console.log(e));
};
