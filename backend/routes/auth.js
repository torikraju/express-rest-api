const express = require('express');
const { body, check } = require('express-validator');
const isAuth = require('../middleware/is-auth');


const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();


router.put('/signup',
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value) => User.findOne({ email: value })
      .then(user => {
        if (user) {
          return Promise.reject('E-Mail exists already, please pick a different one.');
        }
      }))
    .normalizeEmail(),
  body('password', 'Please enter a password with only numbers and text and at least 5 characters.')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .not()
    .isEmpty()
    .trim(),
  authController.signUp);

router.post('/login', authController.login);

router.get('/status', isAuth, authController.getUserStatus);

router.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
);

module.exports = router;
