const express = require('express');
const { body } = require('express-validator');

const damageTypeController = require('../controllers/damage-types');
const isAuth = require('../middleware/auth');

const router = express.Router();

/**
 * http://localhost:3001/auth/signup POST
 *
 * ==Request==
 * data: {
 *  isHomebrew: boolean
 *  damageType: {
 *    name
 *    description
 *  }
 * }
 *
 * ==Response==
 * Success:
 *
 *
 * Failure:
 * status: 401
 * message: Not Authenticated
 *
 * status: 403
 * message: Not Authorized
 *
 * internal server error:
 * status: 500
 * message
 *
 */
router.post(
  '/damageType',
  isAuth,
  [
    body('name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('description').trim()
  ],
  damageTypeController.createDamageType
);
