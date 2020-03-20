// const jwtUtils = require('../util/jwtUtils');
const httpErrors = require('../util/httpErrors');

const getAdminAuth = require('../util/firebaseAuthAdmin');

module.exports = async (req, res, next) => {
  const header = req.get('Authorization');
  if (!header) {
    throw httpErrors.notAuthenticatedError();
  }

  const token = header.split(' ')[1]; // value after 'Bearer '
  try {
    const decodedToken = await getAdminAuth().verifyIdToken(token);
    req.userId = decodedToken.uid;
  } catch (err) {
    console.log('error while authenticating:', err);
    next(httpErrors.notAuthenticatedError());
  }

  next();
};
