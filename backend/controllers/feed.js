const fs = require('fs');
const path = require('path');

const {validationResult} = require('express-validator');

const Post = require('../models/post');
const {throwError, sendError, clearImage} = require('../util/appUtil');

exports.getPosts = (req, res, next) => {
    Post.find()
        .then(posts => res.status(200).json({message: 'Fetched posts successfully', posts}))
        .catch(err => sendError(err, next, 500));
};

exports.createPost = (req, res, next) => {
    const image = req.file;
    if (!image) throwError('No image provided', 422);

    const errors = validationResult(req);
    if (!errors.isEmpty()) throwError('Validation failed, entered data is incorrect.', 422);
    const {title, content} = req.body;
    const post = new Post({
        title,
        content,
        imageUrl: image.path.replace(/\\/g, "/"),
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

exports.updatePost = (req, res, next) => {
    const {postId} = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) throwError('Validation failed, entered data is incorrect.', 422);
    const {title, content} = req.body;
    let imageUrl = req.body.image;
    if (req.file) imageUrl = req.file.path;
    if (!imageUrl) throwError('No image provided', 422);
    Post.findById(postId)
        .then(post => {
            if (!post) throwError('Could not found post.', 404);
            if (imageUrl !== post.imageUrl) clearImage(post.imageUrl);

            post.title = title;
            post.imageUrl = imageUrl;
            post.content = content;
            return post.save();
        })
        .then(result => res.status(200).json({message: 'Post updated!', post: result}))
        .catch(err => sendError(err, next, 500));
};

exports.deletePost = (req, res, next) => {
    const {postId} = req.params;
    Post.findById(postId)
        .then(post => {
            if (!post) throwError('Could not found post.', 404);
            //check logged in user
            clearImage(post.imageUrl);
            return post.remove();
        })
        .then(() => res.status(200).json({message: 'Deleted post'}))
        .catch(err => sendError(err, next, 500))
};
