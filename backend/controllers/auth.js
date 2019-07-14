const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const User = require('../models/user');
const { throwError, sendError, createToken } = require('../util/appUtil');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throwError('Validation failed', 422, errors);
  const { email, name, password } = req.body;
  bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        name
      });
      return user.save();
    })
    .then(result => res.status(201)
      .json({
        message: 'user created',
        userId: result._id
      }))
    .catch(err => sendError(err, next, 500));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email })
    .then(user => {
      if (!user) throwError('A user with this email could not be found', 401);
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) throwError('Invalid username or password', 401);
      const token = createToken(loadedUser);
      res.status(200)
        .json({
          token,
          userId: loadedUser._id.toString()
        });
    })
    .catch(err => sendError(err, next, 500));
};
