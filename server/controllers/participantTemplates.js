const { validationResult } = require('express-validator');
const ParticipantTemplate = require('../model/participantTemplate');
const httpErrors = require('../util/httpErrors');
const responseCodes = require('../util/responseCodes');

module.exports.createParticipantTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const templateData = req.body.template;

    const existingTemplate = await ParticipantTemplate.findOne({
      creator: req.userId,
      name: templateData.name
    });
    if (existingTemplate != null) {
      next(
        httpErrors.validationError([
          {
            value: templateData.name,
            msg: 'Template with this name already exists',
            param: 'name'
          }
        ])
      );
      return;
    }

    const participantTemplate = new ParticipantTemplate({
      ...templateData,
      creator: req.userId
    });

    let savedTemplate = await participantTemplate.save();
    savedTemplate = await ParticipantTemplate.findById(savedTemplate._id)
      .populate({ path: 'vulnerabilities', select: 'name' })
      .populate({ path: 'resistances', select: 'name' })
      .populate({ path: 'features', select: 'name' })
      .populate({ path: 'immunities.damageTypes', select: 'name' })
      .populate({ path: 'immunities.conditions', select: 'name' });

    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Participant template created',
      data: savedTemplate
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateParticipantTemplate = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const templateData = req.body.template;
    const templateId = req.params.templateId;

    let participantTemplate = await ParticipantTemplate.findById(templateId);
    if (!participantTemplate) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (req.userId.toString() !== participantTemplate.creator.toString()) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    if (participantTemplate.name !== templateData.name) {
      const existingTemplate = await ParticipantTemplate.findOne({
        creator: req.userId,
        name: templateData.name
      });
      if (existingTemplate != null) {
        next(
          httpErrors.validationError([
            {
              value: templateData.name,
              msg: 'Template with this name already exists',
              param: 'name'
            }
          ])
        );
        return;
      }
    }

    participantTemplate.type = templateData.type;
    participantTemplate.avatarUrl = templateData.avatarUrl;
    participantTemplate.name = templateData.name;
    participantTemplate.initiativeModifier = templateData.initiativeModifier;
    participantTemplate.maxHp = templateData.maxHp;
    participantTemplate.armorClass = templateData.armorClass;
    participantTemplate.speed = templateData.speed;
    participantTemplate.mapSize = templateData.mapSize;
    participantTemplate.immunities = templateData.immunities;
    participantTemplate.resistances = templateData.resistances;
    participantTemplate.vulnerabilities = templateData.vulnerabilities;
    participantTemplate.features = templateData.features;
    participantTemplate.comment = templateData.comment;

    let savedTemplate = await participantTemplate.save();
    savedTemplate = await ParticipantTemplate.findById(savedTemplate._id)
      .populate({ path: 'vulnerabilities', select: 'name' })
      .populate({ path: 'resistances', select: 'name' })
      .populate({ path: 'features', select: 'name' })
      .populate({ path: 'immunities.damageTypes', select: 'name' })
      .populate({ path: 'immunities.conditions', select: 'name' });

    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Participant template updated',
      data: savedTemplate
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteParticipantTemplate = async (req, res, next) => {
  const templateId = req.params.templateId;
  const userId = req.userId;

  const template = await ParticipantTemplate.findById(templateId);
  if (!template) {
    next(httpErrors.pageNotFoundError());
    return;
  }

  if (
    template.creator.toString() !== userId.toString()
  ) {
    next(httpErrors.notAuthorizedError());
    return;
  }

  await ParticipantTemplate.deleteOne({ _id: templateId });
  res.status(200).json({
    statusCode: 200,
    responseCode: responseCodes.SUCCESS,
    message: 'Participanat template deleted'
  });
};

module.exports.getParticipantTemplates = async (req, res, next) => {
  try {
    const participantTemplates = await ParticipantTemplate.find({
      creator: req.userId
    })
      .populate({ path: 'vulnerabilities', select: 'name' })
      .populate({ path: 'resistances', select: 'name' })
      .populate({ path: 'features', select: 'name' })
      .populate({ path: 'immunities.damageTypes', select: 'name' })
      .populate({ path: 'immunities.conditions', select: 'name' })

      .sort({ name: 1 });

    res.status(200).json(participantTemplates);
  } catch (error) {
    next(error);
  }
};

module.exports.getParticipantTemplate = async (req, res, next) => {
  try {
    const participantTemplate = await ParticipantTemplate.findOne({
      _id: req.params.templateId,
      creator: req.userId
    })
      .populate({ path: 'vulnerabilities', select: 'name' })
      .populate({ path: 'resistances', select: 'name' })
      .populate({ path: 'features', select: 'name' })
      .populate({ path: 'immunities.damageTypes', select: 'name' })
      .populate({ path: 'immunities.conditions', select: 'name' });

    if (!participantTemplate) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    res.status(200).json(participantTemplate);
  } catch (error) {
    next(error);
  }
};
