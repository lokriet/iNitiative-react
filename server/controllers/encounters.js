const Encounter = require('../model/encounter');
const httpErrors = require('../util/httpErrors');
const responseCodes = require('../util/responseCodes');

const {
  encounterValidationSchema,
  participantValidationSchema,
  positionSchema
} = require('../validators/encounter');

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
    let withDataResponse = req.body.withDataResponse;
    if (withDataResponse == null) {
      withDataResponse = true;
    }
    const encounterId = req.params.encounterId;

    let encounter = await Encounter.findById(encounterId).lean();
    if (!encounter) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (req.userId.toString() !== encounter.creator.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    let encounterData = { ...encounter, ...partialUpdate };

    const { error, value } = encounterValidationSchema.validate(encounterData);

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
    let savedEncounter = null;
    if (withDataResponse) {
      savedEncounter = await Encounter.findById(encounterId)
        .populate({ path: 'participants.vulnerabilities', select: 'name color' })
        .populate({ path: 'participants.resistances', select: 'name color' })
        .populate({
          path: 'participants.features',
          select: 'name type description'
        })
        .populate({
          path: 'participants.immunities.damageTypes',
          select: 'name color'
        })
        .populate({
          path: 'participants.immunities.conditions',
          select: 'name description'
        })
        .populate({
          path: 'participants.conditions',
          select: 'name description'
        });
    }

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
      .populate({ path: 'participants.vulnerabilities', select: 'name color' })
      .populate({ path: 'participants.resistances', select: 'name color' })
      .populate({
        path: 'participants.features',
        select: 'name type description'
      })
      .populate({ path: 'participants.immunities.damageTypes', select: 'name color' })
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

module.exports.getLatestEncounter = async (req, res, next) => {
  try {
    const encounter = await Encounter.findOne({creator: req.userId}, 'name updatedAt', { sort: {'updatedAt': -1}});

    res.status(200).json(encounter);
  } catch (error) {
    next(error);
  }
}

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

    await Encounter.findOneAndUpdate(
      { _id: encounterId },
      { $set: { updatedAt: new Date() } }
    );

    res.status(200).json('Update successful');
  } catch (error) {
    next(error);
  }
};


