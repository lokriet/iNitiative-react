const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const User = require('../model/user');
const authController = require('../controllers/auth');


/**
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
 *  userId
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
      .isLength({ min: 7 })
      .withMessage('Password should be at least 7 characters long'),

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

module.exports = router;
