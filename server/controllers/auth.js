const { validationResult } = require('express-validator');
const JSRSASign = require('jsrsasign');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const responseCodes = require('./response-codes');
const constants = require('../constants');

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
        Username: savedUser.username,
        Admin: false
      };
      const header = {
        alg: 'HS512',
        typ: 'JWT'
      };
      const token = JSRSASign.jws.JWS.sign(
        'HS512',
        JSON.stringify(header),
        JSON.stringify(claims),
        constants.JWT_KEY
      );

      return res.status(201).json({
        message: 'User created',
        statusCode: 201,
        responseCode: responseCodes.SUCCESS,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email
          },
          token
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
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
        Username: loadedUser.username,
        Admin: false
      };
      const header = {
        alg: 'HS512',
        typ: 'JWT'
      };
      const token = JSRSASign.jws.JWS.sign(
        'HS512',
        JSON.stringify(header),
        JSON.stringify(claims),
        constants.JWT_KEY
      );

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
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
