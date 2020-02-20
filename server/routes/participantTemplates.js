const express = require('express');
const { body } = require('express-validator');

const participantTemplateController = require('../controllers/participantTemplates');
const isAuth = require('../middleware/auth');
const ParticipantTemplate = require('../model/participantTemplate');

const router = express.Router();

/**
 * Create Participant template
 * http://localhost:3001/conditions/condition POST
 *
 * ==Request==
 * data: {
 *  template: {
 *    ...
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 201
 * body: {
 *  message: participant template created
 *  data: {
 *    name
 *    ...
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
  '/template',
  isAuth,
  [
    body('template.type')
      .exists()
      .withMessage('Type is required')
      .isIn(['monster', 'player'])
      .withMessage('Type must be monster or player'),

    body('template.name')
      .exists()
      .withMessage('Name is required')
      .trim()
      .custom((value, { req }) => {
        return ParticipantTemplate.findOne({
          creator: req.userId,
          name: value
        }).then(existingTemplate => {
          if (existingTemplate) {
            return Promise.reject('Template with this name already exists');
          }
        });
      }),

    body('template.avatarUrl').optional(),

    body('template.initiativeModifier')
      .exists()
      .isInt()
      .withMessage('Initiative Modifier should be a number'),
    body('template.maxHp')
      .isInt({ min: 1 })
      .withMessage('HP should be more than 0'),
    body('template.armorClass')
      .isInt({ min: 0 })
      .withMessage('Armor class should be positive'),
    body('template.speed')
      .isInt({ min: 1 })
      .withMessage('Speed should be more than 0'),
    body('template.mapSize')
      .isInt({ min: 1 })
      .withMessage('Map size should be more than 0'),

    body('template.immunities').optional(),
    body('template.vulnerabilities').isArray().optional(),
    body('template.resistances').isArray().optional(),
    body('template.features').isArray().optional(),

    body('template.comment').optional()
  ],

  participantTemplateController.createParticipantTemplate
);

/**
 * Get all users participant templates
 * http://localhost:3001/participantTemplates GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: [
 *  {
 *    name
 *    ...
 *    creator
 *    _id
 *  }
 * ]
 * 
 */
router.get('/', isAuth, participantTemplateController.getParticipantTemplates);

module.exports = router;
