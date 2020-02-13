const { validationResult } = require('express-validator');
const User = require('../model/user');
const Condition = require('../model/condition');
const responseCodes = require('../util/responseCodes');
const httpErrors = require('../util/httpErrors');

module.exports.createCondition = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
    }

    const isHomebrew = req.body.isHomebrew;
    const conditionData = req.body.condition;

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
          name: conditionData.name
        }
      : {
          isHomebrew: false,
          name: conditionData.name
        };
    const existingCondition = await Condition.findOne(searchConditions);

    if (existingCondition) {
      const error = httpErrors.validationError([
        {
          value: conditionData.name,
          msg: 'Condition with this name already exists',
          param: 'name'
        }
      ]);
      next(error);
      return;
    }

    const condition = new Condition({
      name: conditionData.name,
      description: conditionData.description,
      creator: req.userId,
      isHomebrew: isHomebrew
    });

    const savedCondition = await condition.save();
    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Condition created',
      data: savedCondition
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateCondition = async (req, res, next) => {
  try {
    console.log('updating condition');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const isHomebrew = req.body.isHomebrew;
    const conditionData = req.body.condition;

    const condition = await Condition.findById(conditionData._id);
    if (!condition) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (isHomebrew) {
      if (req.userId.toString() !== condition.creator.toString()) {
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

    if (condition.name !== conditionData.name) {
      const searchConditions = isHomebrew
        ? {
            isHomebrew: true,
            creator: req.userId,
            name: conditionData.name
          }
        : {
            isHomebrew: false,
            name: conditionData.name
          };

      const existingCondition = await Condition.findOne(searchConditions);
      if (existingCondition) {
        next(
          httpErrors.validationError([
            {
              value: conditionData.name,
              msg: 'Condition with this name already exists',
              param: 'name'
            }
          ])
        );
        return;
      }
    }

    condition.name = conditionData.name;
    condition.description = conditionData.description;
    const savedCondition = await condition.save();

    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Condition updated',
      data: savedCondition
    });
  } catch (error) {
    next(error);
  }
};


module.exports.deleteCondition = async (req, res, next) => {
  const conditionId = req.params.conditionId;
  const userId = req.userId;

  const condition = await Condition.findById(conditionId);
  if (!condition) {
    next(httpErrors.pageNotFoundError());
    return;
  }

  if (condition.isHomebrew && condition.creator.toString() !== userId.toString()) {
    next(httpErrors.notAuthorizedError());
    return;
  }

  if (condition.isHomebrew) {
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      next(httpErrors.notAuthorizedError());
      return;
    }
  }

  await Condition.deleteOne({_id: conditionId});
  res.status(200).json({
    statusCode: 200,
    responseCode: responseCodes.SUCCESS,
    message: 'Condition deleted'
  });
}

module.exports.getSharedConditions = async (req, res, next) => {
  try {
    const conditions = await Condition.find({ isHomebrew: false }).sort({
      name: 1
    });
    res.status(200).json(conditions);
  } catch (error) {
    next(error);
  }
};
