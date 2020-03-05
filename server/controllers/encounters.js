const { validationResult } = require('express-validator');

const Encounter = require('../model/encounter');
const httpErrors = require('../util/httpErrors');
const responseCodes = require('../util/responseCodes');

module.exports.createEncounter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const encounterData = req.body.encounter;
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const encounterData = req.body.encounter;
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
  
    if (
      encounter.creator.toString() !== userId.toString()
    ) {
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

    const encounter = await Encounter.findOne(
      { _id: encounterId, creator: req.userId }
    );

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
