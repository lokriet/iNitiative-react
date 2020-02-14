const express = require('express');
const { body } = require('express-validator');

const conditionController = require('../controllers/conditions');
const isAuth = require('../middleware/auth');

const router = express.Router();

/**
 * Create Condition
 * http://localhost:3001/conditions/condition POST
 *
 * ==Request==
 * data: {
 *  isHomebrew: boolean
 *  condition: {
 *    name
 *    description
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  message: Condition created
 *  data: {
 *    name
 *    description
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
 *    msg: 'Condition with this name already exists',
 *    param: 'name'
 *  }]
 *
 * internal server error:
 * status: 500
 * message
 *
 */
router.post(
  '/condition',
  isAuth,
  [
    body('condition.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('condition.description').trim()
  ],
  conditionController.createCondition
);

/**
 * Update condition
 * http://localhost:3001/conditions/condition/:conditionId POST
 *
 * ==Request==
 * data: {
 *  condition: {
 *    name
 *    description
 *    _id
 *  }
 *  isHomebrew
 * }
 *
 * ==Response==
 * Success:
 * status: 200
 * body: {
 *  message: Condition updated
 *  data: {
 *    name
 *    description
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
 *    msg: 'Condition with this name already exists',
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
  '/condition/:conditionId',
  isAuth,
  [
    body('condition.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('condition.description').trim()
  ],
  conditionController.updateCondition
);

/**
 * Delete condition
 * http://localhost:3001/conditions/condition/:conditionId DELETE
 * 
 * ==Response==
 * Success:
 * status: 200
 * message: 'Condition deleted'
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
router.delete('/condition/:conditionId', isAuth, conditionController.deleteCondition);

/**
 * Get all shared (not homebrew) conditions
 * http://localhost:3001/conditions/shared GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    description
 *    isHomebrew
 *    creator
 *    _id
 *  }
 * ]
 * 
 */
router.get('/shared', conditionController.getSharedConditions);


/**
 * Get user's homebrew conditions
 * http://localhost:3001/conditions/homebrew GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    description
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
router.get('/homebrew', isAuth, conditionController.getHomebrewConditions);

module.exports = router;