const express = require('express');
const { body } = require('express-validator');

const damageTypeController = require('../controllers/damageTypes');
const isAuth = require('../middleware/auth');

const router = express.Router();

/**
 * Create damage type
 * http://localhost:3001/damageTypes/damageType POST
 *
 * ==Request==
 * data: {
 *  isHomebrew: boolean
 *  damageType: {
 *    name
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  message: Damage Type created
 *  data: {
 *    name
 *    isHomebrew
 *    creator
 *    _id
 *  }
 * }
 *
 * Failure:
 * status: 401
 * message: Not Authenticated
 *
 * status: 403
 * message: Not Authorized
 * 
 * status: 422
 * message: 'Validation failed'
 *  data: [ (array of them!) {
 *    value: '111',
 *    msg: 'Damage type with this name already exists',
 *    param: 'name'
 *  }]
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
    body('damageType.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required')
  ],
  damageTypeController.createDamageType
);

/**
 * Update damage type
 * http://localhost:3001/damageTypes/damageType/:damageTypeId POST
 *
 * ==Request==
 * data: {
 *  damageType: {
 *    name
 *    _id
 *  }
 *  isHomebrew
 * }
 *
 * ==Response==
 * Success:
 * status: 200
 * body: {
 *  message: Damage Type updated
 *  data: {
 *    name
 *    isHomebrew
 *    creator
 *    _id
 *  }
 * }
 *
 * Failure:
 * status: 401
 * message: Not Authenticated
 *
 * status: 403
 * message: Not Authorized
 * 
 * status: 422
 * message: 'Validation failed'
 *  data: [ (array of them!) {
 *    value: '111',
 *    msg: 'Damage type with this name already exists',
 *    param: 'name'
 *  }]
 * 
 * status: 404
 * message: 'Page not found'
 *
 * internal server error:
 * status: 500
 * message
 *
 */
router.put(
  '/damageType/:damageTypeId',
  isAuth,
  [
    body('damageType.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required')
  ],
  damageTypeController.updateDamageType
);

/**
 * Delete damage type
 * http://localhost:3001/damageTypes/damageType/:damageTypeId DELETE
 * 
 * ==Response==
 * Success:
 * status: 200
 * message: 'Damage type deleted'
 * 
 * Failure:
 * status: 404
 * message: 'Page not found'
 * 
 * status: 403
 * message: 'Not authorized'
 * 
 * status: 401
 * message: 'Not authenticated'
 */
router.delete('/damageType/:damageTypeId', isAuth, damageTypeController.deleteDamageType);

/**
 * Get all shared (not homebrew) damage types
 * http://localhost:3001/damageTypes/shared GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    isHomebrew
 *    creator
 *    _id
 *  }
 * ]
 * 
 */
router.get('/shared', damageTypeController.getSharedDamageTypes);



/**
 * Get user's homebrew damage type
 * http://localhost:3001/damageTypes/homebrew GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    isHomebrew
 *    creator
 *    _id
 *  }
 * ]
 * 
 * Failure:
 * status: 401
 * message: Not authenticated
 */
router.get('/homebrew', isAuth, damageTypeController.getHomebrewDamageTypes);

module.exports = router;