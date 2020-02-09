const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const jwtUtils = require('../util/jwtUtils');
const responseCodes = require('./response-codes');


module.exports.createUser = (req, res, next) => {
  const errors = validationResult(req);

  console.log('in create user');
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error('Validation failed');
    error.statusCode = 422;
    (error.responseCode = responseCodes.VALIDATION_ERROR),
      (error.data = errors.array());
    next(error);
  }

  const email = req.body.email;
  const password = req.body.password;
  const username = req.body.username;

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email,
        password: hashedPassword,
        username
      });

      return user.save();
    })
    .then(savedUser => {
      const claims = {
        userId: savedUser._id,
        Admin: false
      };

      const token = jwtUtils.generateJWT(claims);

      return res.status(201).json({
        message: 'User created',
        statusCode: 201,
        responseCode: responseCodes.SUCCESS,
        data: {
          user: {
            id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
          },
          token
        }
      });
    })
    .catch(err => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const errors = validationResult(req);

  console.log('in login');
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.responseCode = responseCodes.VALIDATION_ERROR;
    error.data = errors.array();
    next(error);
  }

  const email = req.body.email;
  const password = req.body.password;

  let loadedUser;

  return User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error('Wrong username or password');
        error.statusCode = 401;
        error.responseCode = responseCodes.AUTHENTICATION_FAILED;
        throw error;
      }

      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(passwordsMatch => {
      if (!passwordsMatch) {
        const error = new Error('Wrong username or password');
        error.statusCode = 401;
        throw error;
      }

      const claims = {
        userId: loadedUser._id,
        Admin: false
      };
      
      const token = jwtUtils.generateJWT(claims);

      return res.status(200).json({
        message: 'Login successful',
        statusCode: 200,
        responseCode: responseCodes.SUCCESS,
        data: {
          user: {
            id: loadedUser._id,
            username: loadedUser.username,
            email: loadedUser.email
          },
          token
        }
      });
    })
    .catch(err => {
      next(err);
    });
};
