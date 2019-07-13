const {validationResult} = require('express-validator');

const Post = require('../models/post');
const {throwError, sendError} = require('../util/appUtil');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json({message: 'Fetched posts successfully', posts}))
        .catch(err => sendError(err, next, 500));
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
        .catch(err => sendError(err, next, 500));
};

exports.getPost = (req, res, next) => {
    const {postId} = req.params;
    Post.findById(postId)
        .then(post => {
            if (!post) throwError('Could not found post.', 404);
            res.status(200).json({message: 'post fetched', post});
        })
        .catch(err => sendError(err, next, 500))

};
