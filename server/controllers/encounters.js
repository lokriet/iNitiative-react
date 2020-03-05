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
