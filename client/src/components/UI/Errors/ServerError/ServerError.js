import React from 'react';
import PropTypes from 'prop-types';
import ErrorType from '../../../../util/error';
import Error from '../Error/Error';

const ServerValidationError = props => {
  let errors = null;

  if (
    props.serverError &&
    props.serverError.type !== ErrorType.VALIDATION_ERROR
  ) {
    errors = <Error>{props.serverError.message}</Error>;
  }
  return errors;
};

ServerValidationError.propTypes = {
  for: PropTypes.string,
  serverError: PropTypes.object,
  className: PropTypes.string
};

export default ServerValidationError;
