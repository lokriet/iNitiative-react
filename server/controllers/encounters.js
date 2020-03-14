// const { validationResult } = require('express-validator');
const Joi = require('@hapi/joi');

const Encounter = require('../model/encounter');
const httpErrors = require('../util/httpErrors');
const responseCodes = require('../util/responseCodes');

const mapValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    mapUrl: Joi.string()
      .uri()
      .required(),
    mapWidth: Joi.number()
      .min(1)
      .max(2000)
      .required(),
    mapHeight: Joi.number()
      .min(1)
      .max(1500)
      .required(),
    gridWidth: Joi.number()
      .min(1)
      .max(1000)
      .allow(null, ''),
    gridHeight: Joi.number()
      .min(1)
      .max(1000)
      .allow(null, ''),
    gridColor: Joi.string()
      .regex(/^#[0-9a-f]{6}/i)
      .optional(),
    showGrid: Joi.bool().optional(),
    participantCoordinates: Joi.array()
      .items(
        Joi.object()
          .keys({
            _id: Joi.any().optional(),
            participantId: Joi.any().required(),
            mapX: Joi.number()
              .min(0)
              .max(Joi.ref('....mapWidth'))
              .required(),
            mapY: Joi.number()
              .min(0)
              .max(Joi.ref('....mapHeight'))
              .required(),
            infoX: Joi.number().required(),
            infoY: Joi.number().required(),
            gridX: Joi.string().allow(null, ''),
            gridY: Joi.string().allow(null, '')
          })
          .unknown(true)
      )
      .unique((a, b) => {
        let aId;
        if (typeof a.participantId === 'object' && '_id' in a.participantId) {
          aId = a.participantId._id.toString();
        } else {
          aId = a.participantId.toString();
        }

        let bId;
        if (typeof b.participantId === 'object' && '_id' in b.participantId) {
          bId = b.participantId._id.toString();
        } else {
          bId = b.participantId.toString();
        }

        console.log('comparator', aId, bId);
        return aId === bId;
      })
  })
  .unknown(true);

const participantValidationSchema = Joi.object()
  .keys({
    _id: Joi.any().optional(),
    type: Joi.string()
      .equal('player', 'monster')
      .required(),
    avatarUrl: Joi.string()
      .uri()
      .allow(null, ''),
    name: Joi.string()
      .max(200)
      .trim()
      .required(),
    color: Joi.string()
      .regex(/^#[0-9a-f]{6}/i)
      .allow(null, ''),
    initiativeModifier: Joi.number().required(),
    rolledInitiative: Joi.number()
      .min(1)
      .max(20)
      .allow(null, ''),
    maxHp: Joi.number()
      .min(1)
      .required(),
    currentHp: Joi.number()
      .min(0)
      .required(),
    temporaryHp: Joi.number()
      .min(1)
      .allow(null, ''),
    armorClass: Joi.number()
      .min(0)
      .required(),
    temporaryArmorClass: Joi.number()
      .min(0)
      .allow(null, ''),
    speed: Joi.number()
      .min(1)
      .required(),
    swimSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    climbSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    flySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporarySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporarySwimSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporaryClimbSpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    temporaryFlySpeed: Joi.number()
      .min(0)
      .allow(null, ''),
    mapSize: Joi.number()
      .min(1)
      .required(),

    immunities: Joi.object()
      .keys({
        damageTypes: Joi.array()
          .items(Joi.any())
          .required(),
        conditions: Joi.array()
          .items(Joi.any())
          .required()
      })
      .unknown(true),
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
  .unknown(true);

const encounterValidationSchema = Joi.object()
  .keys({
    _tempId: Joi.any().forbidden(),
    _id: Joi.any().optional(),
    name: Joi.string()
      .max(200)
      .trim()
      .required(),
    participants: Joi.array()
      .items(participantValidationSchema)
      .unique((a, b) => a.name === b.name),
    activeParticipantId: Joi.string().allow(null, ''),
    map: mapValidationSchema.allow(null)
  })
  .unknown(true);

module.exports.createEncounter = async (req, res, next) => {
  try {
    let encounterData = req.body.encounter;
    const { error, value } = encounterValidationSchema.validate(encounterData, {
      abortEarly: false
    });

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
      map: null,
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
    let partialUpdate = req.body.partialUpdate;
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

    let encounterData = { ...encounter._doc, ...partialUpdate };

    const { error, value } = encounterValidationSchema.validate(encounterData, {
      abortEarly: false
    });

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

    await Encounter.findOneAndUpdate({ _id: encounterId }, encounterData);
    let savedEncounter = await Encounter.findById(encounterId)
      .populate({ path: 'participants.vulnerabilities', select: 'name' })
      .populate({ path: 'participants.resistances', select: 'name' })
      .populate({
        path: 'participants.features',
        select: 'name type description'
      })
      .populate({ path: 'participants.immunities.damageTypes', select: 'name' })
      .populate({
        path: 'participants.immunities.conditions',
        select: 'name description'
      })
      .populate({
        path: 'participants.conditions',
        select: 'name description'
      });

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
      .populate({
        path: 'participants.features',
        select: 'name type description'
      })
      .populate({ path: 'participants.immunities.damageTypes', select: 'name' })
      .populate({
        path: 'participants.immunities.conditions',
        select: 'name description'
      })
      .populate({
        path: 'participants.conditions',
        select: 'name description'
      });

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

module.exports.updateEncounterParticipant = async (req, res, next) => {
  try {
    const encounterId = req.params.encounterId;
    const participantId = req.params.participantId;

    let encounter = await Encounter.findById(encounterId);
    if (!encounter) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (req.userId.toString() !== encounter.creator.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    let participant = encounter.participants.find(
      item => item._id.toString() === participantId
    );
    if (!participant) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    const participantEditedFields = req.body.partialUpdate;
    let newParticipantData = {
      ...participant._doc,
      ...participantEditedFields
    };

    const { error, value } = participantValidationSchema.validate(
      newParticipantData,
      {
        abortEarly: false
      }
    );

    if (error) {
      next(httpErrors.joiValidationError(error));
      return;
    }

    await Encounter.findOneAndUpdate(
      { _id: encounterId, 'participants._id': participantId },
      {
        $set: {
          'participants.$': newParticipantData
        }
      }
    );

    await Encounter.findOneAndUpdate( {_id: encounterId }, {$set: {'updatedAt': new Date()}});


    res.status(200).json('Update successful');
  } catch (error) {
    next(error);
  }
};
