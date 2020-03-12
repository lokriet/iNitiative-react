const responseCodes = require('./responseCodes');

module.exports.pageNotFoundError = () => {
  const error = new Error('Page not found');
  error.statusCode = 404;
  error.responseCode = responseCodes.PAGE_NOT_FOUND;
  return error;
};

module.exports.notAuthenticatedError = (message) => {
  const error = new Error(message || 'Authentication failed');
  error.statusCode = 401;
  error.responseCode = responseCodes.AUTHENTICATION_FAILED;
  return error;
}


module.exports.notAuthorizedError = () => {
  const error = new Error('Not Authorized');
  error.statusCode = 403;
  error.responseCode = responseCodes.NOT_AUTHORIZED;
  return error;
}

module.exports.validationError = errorData => {
  const error = new Error('Validation failed');
  error.statusCode = 422;
  error.responseCode = responseCodes.VALIDATION_ERROR;
  error.data = errorData
  return error;
}

module.exports.joiValidationError = errorData => {
  const error = new Error('Validation failed');
  error.statusCode = 422;
  error.responseCode = responseCodes.VALIDATION_ERROR;
  error.data = errorData
  return error;
}
