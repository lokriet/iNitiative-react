const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require('../model/user');

const responseCodes = require('../util/responseCodes');
const httpErrors = require('../util/httpErrors');

const getAdminAuth = require('../util/firebaseAuthAdmin');

const jwt = require('jsonwebtoken');
const util = require('../util/util');
const mailSender = require('../util/mailSender');

module.exports.createUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
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

    let token;
    try {
      token = await getAdminAuth().createCustomToken(userId, additionalClaims);
    } catch (error) {
      await User.deleteOne({ _id: userId });
      next(error);
      return;
    }

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

    const userId = user._id;
    const additionalClaims = {
      isAdmin: user.isAdmin
    };
    const token = await getAdminAuth().createCustomToken(
      userId.toString(),
      additionalClaims
    );

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

module.exports.sendPasswordResetEmail = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }


    const email = req.body.email;
    const user = await User.findOne({ email });
    // if (!user) {
    //   return next(httpErrors.validationError({message: 'User with this email does not exist'}));
    // }

    const passwordResetIdentificator = util.generateIdentificator();

    const payload = {
      passwordResetIdentificator
    };

    user.passwordResetIdentificator = passwordResetIdentificator;
    await user.save();

    const mailToken = jwt.sign(payload, process.env.PASSWORD_RESET_SECRET, {
      expiresIn: '3h'
    });

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO || user.email,
      subject: `Reset password link`,
      html: `
            <h1>Please use the following link to reset your iNitiative password</h1>
            <p>${process.env.CLIENT_URL}/resetPassword/${mailToken}</p>
            <p>This link will expire in 3 hours. You can request a new link from the application.</p>
            <hr />
            <p>If you did not request password reset, please ignore this message.</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>${process.env.CLIENT_URL}</p>
        `
    };
    await mailSender.send(emailData);

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log(errors);
      next(httpErrors.validationError(errors.array()));
      return;
    }

    const requestData = req.body;

    const decodedToken = jwt.verify(
      requestData.resetPasswordToken,
      process.env.PASSWORD_RESET_SECRET
    );
    const passwordResetIdentificator = decodedToken.passwordResetIdentificator;
    const user = await User.findOne({ passwordResetIdentificator });
    if (!user) {
      return next(
        httpErrors.validationError([
          {
            value: requestData.resetPasswordToken,
            msg: 'Invalid token',
            param: 'resetPasswordToken'
          }
        ])
      );
    }
    const hashedPassword = await bcrypt.hash(requestData.password, 12);
    user.password = hashedPassword;
    user.passwordResetIdentificator = null;
    await user.save();

    res.status(200).send();
  } catch (error) {
    next(error);
  }
};
