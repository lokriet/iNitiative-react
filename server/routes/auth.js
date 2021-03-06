const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../model/user');
const authController = require('../controllers/auth');


/**
 * Register a new user
 * http://localhost:3001/auth/signup POST 
 * 
 * ==Request==
 * data: {
 *  username
 *  email: required
 *  password: minLength 6
 * }
 * 
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  responseCode: SUCCESS
 *  message: 'User created'
 *  user: {
 *    username
 *    email
 *    id
 *    isAdmin
 *  }
 *  token
 * }
 * 
 * Error: 
 * status 422 - validation error
 * body: {
 *  responseCode: VALIDATION_ERROR
 *  message: 'Validation failed'
 *  data: [ (array of them!) {
 *    value: '12345',
 *    msg: 'Password should be at least 6 characters long',
 *    param: 'password'
 *  }]
 * }
 * 
 * status 500 - internal server error
 * no body (?)
 */
router.post(
  '/signup',
  [
    body('username').trim(),

    body('password')
      .exists()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password should be at least 6 characters long'),

    body('email')
      .exists()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid e-mail')
      .bail()
      .custom((value, { req }) => {
        return User.findOne({ email: value })
          .then(user => {
            if (user) {
              return Promise.reject('Email address already in use');
            }
          });
      })
  ],

  authController.createUser
);

/**
 * Login
 * http://localhost:3001/auth/signin POST 
 * 
 * ==Request==
 * data: {
 *  username
 *  email: required
 *  password: minLength 6
 * }
 * 
 * ==Response==
 * Success:
 * status: 200
 * body: {
 *  responseCode: SUCCESS
 *  message: 'Login successful'
 *  user: {
 *    username
 *    email
 *    id
 *    isAdmin
 *  }
 *  token
 * }
 * 
 * Error: 
 * status 422 - validation error
 * body: {
 *  responseCode: VALIDATION_ERROR
 *  message: 'Validation failed'
 *  data: [ (array of them!) {
 *    value: '12345',
 *    msg: 'Password should be at least 6 characters long',
 *    param: 'password'
 *  }]
 * }
 * 
 * status 401 - wrong credentials
 * body: {
 *  responseCode: AUTHENTICATION_FAILED
 *  message: 'Wrong username or password'
 * }
 * 
 * status 500 - internal server error
 * no body (?)
 */
router.post('/signin',
[
  body('password')
  .exists()
  .notEmpty()
  .withMessage('Password is required'),

  body('email')
  .exists()
  .withMessage('Email is required')
],

authController.login);

router.post('/sendPasswordResetEmail', 
[
  body('email')
  .exists()
  .isEmail()
  .normalizeEmail()
  .withMessage('Please enter a valid e-mail')
  .bail()
  .custom((value, { req }) => {
    return User.findOne({ email: value })
      .then(user => {
        if (!user) {
          return Promise.reject('User with this email does not exist');
        }
      });
  })
],

authController.sendPasswordResetEmail);

router.post('/resetPassword', 
[
  body('password')
  .exists()
  .notEmpty()
  .withMessage('Password is required'),

  body('resetPasswordToken')
  .exists()
  .notEmpty()
  .withMessage('Token is required')
],

authController.resetPassword);

module.exports = router;
