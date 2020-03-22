const { validationResult } = require('express-validator');
const User = require('../model/user');
const DamageType = require('../model/damageType');
const responseCodes = require('../util/responseCodes');
const httpErrors = require('../util/httpErrors');

module.exports.createDamageType = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const isHomebrew = req.body.isHomebrew;
    const damageTypeData = req.body.damageType;

    if (!isHomebrew) {
      const user = await User.findById(req.userId);
      if (!user.isAdmin) {
        next(httpErrors.notAuthorizedError());
        return;
      }
    }

    const conditions = isHomebrew
      ? {
          isHomebrew: true,
          creator: req.userId,
          name: damageTypeData.name
        }
      : {
          isHomebrew: false,
          name: damageTypeData.name
        };
    const existingDamageType = await DamageType.findOne(conditions);

    if (existingDamageType) {
      const error = httpErrors.validationError([
        {
          value: damageTypeData.name,
          msg: 'Damage type with this name already exists',
          param: 'name'
        }
      ]);
      next(error);
      return;
    }

    const damageType = new DamageType({
      name: damageTypeData.name,
      color: damageTypeData.color,
      creator: req.userId,
      isHomebrew: isHomebrew
    });

    const savedDamageType = await damageType.save();
    res.status(201).json({
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      message: 'Damage Type created',
      data: savedDamageType
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateDamageType = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const isHomebrew = req.body.isHomebrew;
    const damageTypeData = req.body.damageType;

    const damageType = await DamageType.findById(damageTypeData._id);
    if (!damageType) {
      next(httpErrors.pageNotFoundError());
      return;
    }

    if (isHomebrew) {
      if (req.userId.toString() !== damageType.creator.toString()) {
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

    if (damageType.name !== damageTypeData.name) {
      const damageTypeConditions = isHomebrew
        ? {
            isHomebrew: true,
            creator: req.userId,
            name: damageTypeData.name
          }
        : {
            isHomebrew: false,
            name: damageTypeData.name
          };

      const existingDamageType = await DamageType.findOne(damageTypeConditions);
      if (existingDamageType) {
        next(
          httpErrors.validationError([
            {
              value: damageTypeData.name,
              msg: 'Damage type with this name already exists',
              param: 'name'
            }
          ])
        );
        return;
      }
    }

    damageType.name = damageTypeData.name;
    damageType.color = damageTypeData.color;
    const savedDamageType = await damageType.save();

    res.status(200).json({
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      message: 'Damage type updated',
      data: savedDamageType
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteDamageType = async (req, res, next) => {
  const damageTypeId = req.params.damageTypeId;
  const userId = req.userId;

  const damageType = await DamageType.findById(damageTypeId);
  if (!damageType) {
    next(httpErrors.pageNotFoundError());
    return;
  }

  if (
    damageType.isHomebrew &&
    damageType.creator.toString() !== userId.toString()
  ) {
    next(httpErrors.notAuthorizedError());
    return;
  }

  if (!damageType.isHomebrew) {
    const user = await User.findById(userId);
    if (!user.isAdmin) {
      next(httpErrors.notAuthorizedError());
      return;
    }
  }

  await DamageType.deleteOne({ _id: damageTypeId });
  res.status(200).json({
    statusCode: 200,
    responseCode: responseCodes.SUCCESS,
    message: 'Damage type deleted'
  });
};

module.exports.getSharedDamageTypes = async (req, res, next) => {
  try {
    const damageTypes = await DamageType.find({ isHomebrew: false })
      .collation({ locale: 'en' })
      .sort({
        name: 1
      });
    res.status(200).json(damageTypes);
  } catch (error) {
    next(error);
  }
};

module.exports.getHomebrewDamageTypes = async (req, res, next) => {
  try {
    const damageTypes = await DamageType.find({
      isHomebrew: true,
      creator: req.userId
    })
      .collation({ locale: 'en' })
      .sort({ name: 1 });
    res.status(200).json(damageTypes);
  } catch (error) {
    next(error);
  }
};
