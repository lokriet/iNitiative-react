import React from 'react';
import PropTypes from 'prop-types';
import ErrorType from '../../../util/error';

const ServerValidationError = props => {
  let errors = null;

  if (
    props.serverError &&
    props.serverError.type !== ErrorType.VALIDATION_ERROR
  ) {
    errors = <div className={props.className}>{props.serverError.message}</div>;
  }
  return errors;
};

ServerValidationError.propTypes = {
  for: PropTypes.string,
  serverError: PropTypes.object,
  className: PropTypes.string
};

export default ServerValidationError;
