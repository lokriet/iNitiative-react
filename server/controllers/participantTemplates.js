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
      .populate({ path: 'immunities.conditions', select: 'name' })

    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Participant template created',
      data: savedTemplate
    });
  } catch(error) {
    next(error);
  }
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
