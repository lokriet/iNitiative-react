const jwtUtils = require('../util/jwtUtils');
const httpErrors = require('../util/httpErrors');

module.exports = (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    throw httpErrors.notAuthenticatedError();
  }

  const token = header.split(' ')[1]; // value after 'Bearer '
  let decodedToken;
  try {
    const isValid = jwtUtils.validateJWT(token);
    if (!isValid) {
      throw httpErrors.notAuthenticatedError();
    }

    decodedToken = jwtUtils.decodeJWT(token);
    req.userId = decodedToken.userId;
  } catch (err) {
    throw err;
  }

  next();
};
