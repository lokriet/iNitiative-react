const { validationResult } = require('express-validator');
const User = require('../model/user');
const Feature = require('../model/feature');
const responseCodes = require('../util/responseCodes');
const httpErrors = require('../util/httpErrors');

module.exports.createFeature = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
    }

    const isHomebrew = req.body.isHomebrew;
    const featureData = req.body.feature;

    if (!isHomebrew) {
      const user = await User.findById(req.userId);
      if (!user.isAdmin) {
        next(httpErrors.notAuthorizedError());
      }
    }

    const searchConditions = isHomebrew
      ? {
          isHomebrew: true,
          creator: req.userId,
          name: featureData.name
        }
      : {
          isHomebrew: false,
          name: featureData.name
        };
    const existingFeature = await Feature.findOne(searchConditions);

    if (existingFeature) {
      const error = httpErrors.validationError([
        {
          value: featureData.name,
          msg: 'Feature with this name already exists',
          param: 'name'
        }
      ]);
      next(error);
      return;
    }

    const feature = new Feature({
      name: featureData.name,
      description: featureData.description,
      type: featureData.type,
      creator: req.userId,
      isHomebrew: isHomebrew
    });

    const savedFeature = await feature.save();
    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Feature created',
      data: savedFeature
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateFeature = async (req, res, next) => {
  try {
    console.log('updating feature');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const isHomebrew = req.body.isHomebrew;
    const featureData = req.body.feature;

    const feature = await Feature.findById(featureData._id);
    if (!feature) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (isHomebrew) {
      if (req.userId.toString() !== feature.creator.toString()) {
        next(httpErrors.notAuthorizedError());
        return;
      }
    } else {
      const user = await User.findById(req.userId);
      if (!user.isAdmin) {
        next(httpErrors.notAuthorizedError());
        return;
      }
    }

    if (feature.name !== featureData.name) {
      const searchConditions = isHomebrew
        ? {
            isHomebrew: true,
            creator: req.userId,
            name: featureData.name
          }
        : {
            isHomebrew: false,
            name: featureData.name
          };

      const existingFeature = await Feature.findOne(searchConditions);
      if (existingFeature) {
        next(
          httpErrors.validationError([
            {
              value: featureData.name,
              msg: 'Feature with this name already exists',
              param: 'name'
            }
          ])
        );
        return;
      }
    }

    feature.name = featureData.name;
    feature.description = featureData.description;
    feature.type = featureData.type;
    const savedFeature = await feature.save();

    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Feature updated',
      data: savedFeature
    });
  } catch (error) {
    next(error);
  }
};


module.exports.deleteFeature = async (req, res, next) => {
  const featureId = req.params.featureId;
  const userId = req.userId;

  const feature = await Feature.findById(featureId);
  if (!feature) {
    next(httpErrors.pageNotFoundError());
    return;
  }

  if (feature.isHomebrew && feature.creator.toString() !== userId.toString()) {
    next(httpErrors.notAuthorizedError());
    return;
  }

  if (feature.isHomebrew) {
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      next(httpErrors.notAuthorizedError());
      return;
    }
  }

  await Feature.deleteOne({_id: featureId});
  res.status(200).json({
    statusCode: 200,
    responseCode: responseCodes.SUCCESS,
    message: 'Feature deleted'
  });
}

module.exports.getSharedFeatures = async (req, res, next) => {
  try {
    const features = await Feature.find({ isHomebrew: false }).sort({
      name: 1
    });
    res.status(200).json(features);
  } catch (error) {
    next(error);
  }
};
