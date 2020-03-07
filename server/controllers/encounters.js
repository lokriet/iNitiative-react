// const { validationResult } = require('express-validator');
const Joi = require('@hapi/joi');

const Encounter = require('../model/encounter');
const httpErrors = require('../util/httpErrors');
const responseCodes = require('../util/responseCodes');

const encounterValidationSchema = Joi.object({
  _tempId: Joi.any().forbidden(),
  _id: Joi.any().optional(),
  name: Joi.string()
    .alphanum()
    .max(200)
    .trim()
    .required(),
  participants: Joi.array()
    .items(
      Joi.object({
        _id: Joi.any().optional(),
        type: Joi.string()
          .equal('player', 'monster')
          .required(),
        avatarUrl: Joi.string()
          .uri()
          .allow(null),
        name: Joi.string()
          .max(200)
          .trim()
          .required(),
        color: Joi.string()
          .regex(/^#[0-9a-f]{6}/i)
          .allow(null),
        initiativeModifier: Joi.number().required(),
        rolledInitiative: Joi.number()
          .min(1)
          .max(20)
          .allow(null),
        maxHp: Joi.number()
          .min(1)
          .required(),
        currentHp: Joi.number()
          .min(0)
          .required(),
        temporaryHp: Joi.number()
          .min(1)
          .allow(null),
        armorClass: Joi.number()
          .min(0)
          .required(),
        temporaryArmorClass: Joi.number()
          .min(0)
          .allow(null),
        speed: Joi.number()
          .min(1)
          .required(),
        swimSpeed: Joi.number()
          .min(0)
          .allow(null),
        climbSpeed: Joi.number()
          .min(0)
          .allow(null),
        flySpeed: Joi.number()
          .min(0)
          .allow(null),
        temporarySpeed: Joi.number()
          .min(0)
          .allow(null),
        temporarySwimSpeed: Joi.number()
          .min(0)
          .allow(null),
        temporaryClimbSpeed: Joi.number()
          .min(0)
          .allow(null),
        temporaryFlySpeed: Joi.number()
          .min(0)
          .allow(null),
        mapSize: Joi.number()
          .min(1)
          .required(),

        immunities: Joi.object({
          damageTypes: Joi.array()
            .items(Joi.any())
            .required(),
          conditions: Joi.array()
            .items(Joi.any())
            .required()
        }),
        vulnerabilities: Joi.array()
          .items(Joi.any())
          .required(),
        resistances: Joi.array()
          .items(Joi.any())
          .required(),
        features: Joi.array()
          .items(Joi.any())
          .required(),
        conditions: Joi.array()
          .items(Joi.any())
          .required(),

        advantages: Joi.string()
          .max(5000)
          .trim()
          .allow(null, ''),
        comment: Joi.string()
          .max(5000)
          .trim()
          .allow(null, '')
      })
    )
    .unique((a, b) => a.name === b.name)
});

module.exports.createEncounter = async (req, res, next) => {
  try {
    let encounterData = req.body.encounter;
    const { error, value } = encounterValidationSchema.validate(encounterData, {abortEarly: false});

    if (error) {
      next(httpErrors.joiValidationError(error));
      return;
    }

    encounterData = value;

    const existingEncounter = await Encounter.findOne({
      name: encounterData.name,
      creator: req.userId
    });
    if (existingEncounter) {
      next(
        httpErrors.validationError([
          {
            value: encounterData.name,
            msg: 'Encounter with this name already exists',
            param: 'encounter.name'
          }
        ])
      );
      return;
    }

    let encounter = new Encounter({
      name: encounterData.name,
      participants: encounterData.participants,
      creator: req.userId
    });
    encounter = await encounter.save();

    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Encounter created',
      data: encounter
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateEncounter = async (req, res, next) => {
  try {
    let encounterData = req.body.encounter;
    const encounterId = req.params.encounterId;

    let encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (req.userId.toString() !== encounter.creator.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    const { error, value } = encounterValidationSchema.validate(encounterData, {abortEarly: false});

    if (error) {
      next(httpErrors.joiValidationError(error));
      return;
    }

    encounterData = value;

    if (encounter.name !== encounterData.name) {
      const existingEncounter = await Encounter.findOne({
        creator: req.userId,
        name: encounterData.name
      });
      if (existingEncounter != null) {
        next(
          httpErrors.validationError([
            {
              value: encounterData.name,
              msg: 'Encounter with this name already exists',
              param: 'name'
            }
          ])
        );
        return;
      }
    }

    encounter.name = encounterData.name;
    encounter.participants = encounterData.participants;

    let savedEncounter = await encounter.save();

    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Encounter updated',
      data: savedEncounter
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteEncounter = async (req, res, next) => {
  try {
    const encounterId = req.params.encounterId;
    const userId = req.userId;

    const encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (encounter.creator.toString() !== userId.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    await Encounter.deleteOne({ _id: encounterId });
    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Encounter deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getEncounter = async (req, res, next) => {
  try {
    const encounterId = req.params.encounterId;

    const encounter = await Encounter.findOne({
      _id: encounterId,
      creator: req.userId
    })
    .populate({ path: 'participants.vulnerabilities', select: 'name' })
    .populate({ path: 'participants.resistances', select: 'name' })
    .populate({ path: 'participants.features', select: 'name type description' })
    .populate({ path: 'participants.immunities.damageTypes', select: 'name' })
    .populate({ path: 'participants.immunities.conditions', select: 'name description' })
    .populate({ path: 'participants.conditions', select: 'name description' });

    if (!encounter) {
      httpErrors.pageNotFoundError();
      return;
    }

    res.status(200).json(encounter);
  } catch (error) {
    next(error);
  }
};

module.exports.getEncounters = async (req, res, next) => {
  try {
    const encounters = await Encounter.find(
      { creator: req.userId },
      'name createdAt updatedAt'
    ).sort({ updatedAt: -1 });
    res.status(200).json(encounters);
  } catch (error) {
    next(error);
  }
};
