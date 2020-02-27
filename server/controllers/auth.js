const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const responseCodes = require('../util/responseCodes');
const httpErrors = require('../util/httpErrors');

const getAdminAuth = require('../util/firebaseAuthAdmin');


module.exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log('in create user');
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      password: hashedPassword,
      username,
      isAdmin: false
    });

    const savedUser = await user.save();
    
    const userId = savedUser._id.toString();
    const additionalClaims = {
      isAdmin: savedUser.isAdmin
    };

    // console.log('created user', userId);
    let token;
    try {
      token = await getAdminAuth().createCustomToken(userId, additionalClaims);
    } catch (error) {
      await User.deleteOne({_id: userId});
      next(error);
      return;
    }
    // const token = jwtUtils.generateJWT(claims);

    return res.status(201).json({
      message: 'User created',
      statusCode: 201,
      responseCode: responseCodes.SUCCESS,
      data: {
        user: {
          id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          isAdmin: savedUser.isAdmin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    console.log('in login');
    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email });
    if (!user) {
      next(httpErrors.notAuthenticatedError('Wrong username or password'));
      return;
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      next(httpErrors.notAuthenticatedError('Wrong username or password'));
      return;
    }

    // const claims = {
    //   userId: user._id,
    //   isAdmin: user.isAdmin
    // };

    // const token = jwtUtils.generateJWT(claims);
    const userId = user._id;
    console.log('userId: ', userId);
    const additionalClaims = {
      isAdmin: user.isAdmin
    };
    const token = await getAdminAuth().createCustomToken(userId.toString(), additionalClaims);

    return res.status(200).json({
      message: 'Login successful',
      statusCode: 200,
      responseCode: responseCodes.SUCCESS,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};
