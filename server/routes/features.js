const express = require('express');
const { body } = require('express-validator');

const featureController = require('../controllers/features');
const isAuth = require('../middleware/auth');

const router = express.Router();

/**
 * Create Feature
 * http://localhost:3001/features/feature POST
 *
 * ==Request==
 * data: {
 *  isHomebrew: boolean
 *  feature: {
 *    name
 *    type
 *    description
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  message: Feature created
 *  data: {
 *    name
 *    type
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
 *    msg: 'Feature with this name already exists',
 *    param: 'name'
 *  }]
 *
 * internal server error:
 * status: 500
 * message
 *
 */
router.post(
  '/feature',
  isAuth,
  [
    body('feature.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('feature.description').trim(),

    body('feature.type').trim()
  ],
  featureController.createFeature
);

/**
 * Update feature
 * http://localhost:3001/features/feature/:featureId POST
 *
 * ==Request==
 * data: {
 *  feature: {
 *    name
 *    type
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
 *  message: Feature updated
 *  data: {
 *    name
 *    type
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
 *    msg: 'Feature with this name already exists',
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
  '/feature/:featureId',
  isAuth,
  [
    body('feature.name')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('feature.description').trim(),

    body('feature.type').trim()
  ],
  featureController.updateFeature
);

/**
 * Delete feature
 * http://localhost:3001/features/feature/:featureId DELETE
 * 
 * ==Response==
 * Success:
 * status: 200
 * message: 'Feature deleted'
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
router.delete('/feature/:featureId', isAuth, featureController.deleteFeature);

/**
 * Get all shared (not homebrew) features
 * http://localhost:3001/features/shared GET
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
router.get('/shared', featureController.getSharedFeatures);

/**
 * Get user's homebrew features
 * http://localhost:3001/features/homebrew GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    description
 *    type
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
router.get('/homebrew', isAuth, featureController.getHomebrewFeatures);

module.exports = router;