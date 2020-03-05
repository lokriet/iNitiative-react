const express = require('express');
const { body } = require('express-validator');

const encounterController = require('../controllers/encounters');
const isAuth = require('../middleware/auth');

const router = express.Router();

/**
 * Create Encounter
 * http://localhost:3001/encounters/encounter POST
 *
 * ==Request==
 * data: {
 *  encounter: {
 *    name: ...
 *    ...
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  message: encounter created
 *  data: {
 *    name
 *    ...
 *    creator
 *    _id
 *    createdAt:  "2020-03-04T22:00:15.057Z"
 *    updatedAt:  "2020-05-06T23:00:15.057Z"
 *  }
 * }
 *
 * Failure:
 * status: 401
 * message: Not Authenticated
 *
 * status: 422
 * message: 'Validation failed'
 *  data: [ (array of them!) {
 *    value: '111',
 *    msg: 'Template with this name already exists',
 *    param: 'name'
 *  }]
 *
 * internal server error:
 * status: 500
 * message
 *
 */
router.post(
  '/encounter',
  isAuth,
  [
    body('encounter.name')
      .exists()
      .withMessage('Encounter name is required')
      .trim()
  ],
  encounterController.createEncounter
);

router.put(
  '/encounter/:encounterId',
  isAuth,
  [
    body('encounter.name')
      .exists()
      .withMessage('Encounter name is required')
      .trim()
  ],
  encounterController.updateEncounter
);

/**
 * Delete encounter
 * http://localhost:3001/encounters/encounter/:encounterId DELETE
 *
 * ==Response==
 * Success:
 * status: 200
 * message: 'Encounter deleted'
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
router.delete(
  '/encounter/:encounterId',
  isAuth,
  encounterController.deleteEncounter
);

/**
 * Get encounter by id
 * http://localhost:3001/encounters/:encounterId GET
 *
 * ==Response==
 * Success:
 * status: 200
 * data:
 *  {
 *    name
 *    creator
 *    _id
 *    createdAt:  "2020-03-04T22:00:15.057Z"
 *    updatedAt:  "2020-05-06T23:00:15.057Z"
 *  }
 */
router.get('/:encounterId', isAuth, encounterController.getEncounter);

/**
 * Get all users encounters
 * http://localhost:3001/encounters GET
 *
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    creator
 *    _id
 *    createdAt:  "2020-03-04T22:00:15.057Z"
 *    updatedAt:  "2020-05-06T23:00:15.057Z"
 *  }
 * ]
 */
router.get('/', isAuth, encounterController.getEncounters);

module.exports = router;
