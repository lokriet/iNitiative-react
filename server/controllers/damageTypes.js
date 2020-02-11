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
    }

    const isHomebrew = req.body.isHomebrew;
    const damageTypeData = req.body.damageType;

    if (!isHomebrew) {
      const user = await User.findById(req.userId);
      if (!user.isAdmin) {
        next(httpErrors.notAuthorizedError());
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
    const damageType = await DamageType.findOne(conditions);

    if (damageType) {
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
      description: damageTypeData.description,
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

    const isHomebrew = req.data.isHomebrew;
    const damageTypeData = req.data.damageType;

    const userConditions = isHomebrew
      ? {
          _id: req.userId,
          isAdmin: true
        }
      : {
          _id: req.userId
        };
    const user = await User.findOne(userConditions);
    if (user) {
      next(httpErrors.notAuthorizedError());
      return;
    }

    const damageType = await DamageType.findById(damageTypeData._id);
    if (!damageType) {
      next(httpErrors.pageNotFoundError());
      return;
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
      
      const existingdamageType = await DamageType.findOne(damageTypeConditions);
      if (existingdamageType) {
        next(httpErrors.validationError([{
          value: damageTypeData.name,
          msg: 'Damage type with this name already exists',
          param: 'name'
        }]));
        return;
      }
    }

    damageType.name = damageTypeData.name;
    damageType.description = damageTypeData.description;
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
