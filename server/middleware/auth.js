const jwtUtils = require('../util/jwtUtils');

module.exports = (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    const err = new Error('Not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const token = header.split(' ')[1]; // value after 'Bearer '
  let decodedToken;
  try {
    const isValid = jwtUtils.validateJWT(token);
    if (!isValid) {
      const err = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    decodedToken = jwtUtils.decodeJWT(token);
    req.userId = decodedToken.userId;
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  next();
};
