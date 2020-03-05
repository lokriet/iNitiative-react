const express = require('express');
const { body } = require('express-validator');

const participantTemplateController = require('../controllers/participantTemplates');
const isAuth = require('../middleware/auth');
const ParticipantTemplate = require('../model/participantTemplate');

const router = express.Router();

/**
 * Create Participant template
 * http://localhost:3001/participantTemplates/template POST
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
    body('template.swimSpeed')
      .optional({checkFalsy: true, nullable: true})
      .isInt({ min: 1 })
      .withMessage('Speed should be more than 0'),
    body('template.climbSpeed')
      .optional({checkFalsy: true, nullable: true})
      .isInt({ min: 1 })
      .withMessage('Speed should be more than 0'),
    body('template.flySpeed')
      .optional({checkFalsy: true, nullable: true})
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
 * Update Participant template
 * http://localhost:3001/participantTemplates/template/:id PUT
 *
 * ==Request==
 * data: {
 *  template: {
 *    _id: ...
 *    ...
 *  }
 * }
 *
 * ==Response==
 * Success:
 * status: 200
 * body: {
 *  message: participant template updated
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
router.put(
  '/template/:templateId',
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
      .trim(),

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
    body('template.swimSpeed')
      .optional({checkFalsy: true, nullable: true})
      .isInt({ min: 1 })
      .withMessage('Speed should be more than 0'),
    body('template.climbSpeed')
      .optional({checkFalsy: true, nullable: true})
      .isInt({ min: 1 })
      .withMessage('Speed should be more than 0'),
    body('template.flySpeed')
      .optional({checkFalsy: true, nullable: true})
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

  participantTemplateController.updateParticipantTemplate
);

/**
 * Delete participant template
 * http://localhost:3001/participantTemplates/template/:templateId DELETE
 * 
 * ==Response==
 * Success:
 * status: 200
 * message: 'Participant template deleted'
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
router.delete('/template/:templateId', isAuth, participantTemplateController.deleteParticipantTemplate);


/**
 * Get users participant template by id
 * http://localhost:3001/participantTemplates/:templateId GET
 * 
 * ==Response==
 * Success:
 * status: 200
 * data: 
 *  {
 *    name
 *    ...
 *    creator
 *    _id
 *  }
 * 
 * 
 */
router.get('/:templateId', isAuth, participantTemplateController.getParticipantTemplate);

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
