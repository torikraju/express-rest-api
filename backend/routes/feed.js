const express = require('express');
const {body} = require('express-validator');

const feedController = require('../controllers/feed');

const router = express.Router();


router.get('/posts', feedController.getPosts);


router.post('/post',
    body('title')
        .isString()
        .isLength({min: 5}).trim(),
    body('content')
        .isLength({min: 5, max: 400})
        .trim(),
    feedController.createPost);

module.exports = router;
