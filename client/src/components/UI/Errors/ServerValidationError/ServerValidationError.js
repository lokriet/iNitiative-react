import React from 'react';
import PropTypes from 'prop-types';
import ErrorType from '../../../../util/error';
import Error from '../Error/Error';

const ServerValidationError = props => {
  let errors = null;

  if (
    props.serverError &&
    props.serverError.type === ErrorType.VALIDATION_ERROR &&
    props.serverError.data &&
    props.serverError.data.length > 0
  ) {
    const myErrors = props.for ? props.serverError.data.filter(
      error => {
        const name = error.param.split('.').pop();
        return name === props.for
      }
      ) : props.serverError.data;
    if (myErrors.length > 0) {
      errors = (
        <>
          {myErrors.map((error, index) => (
            <Error key={index}>{error.msg}</Error>
          ))}
        </>
      );
    }
  }
  return errors;
};

ServerValidationError.propTypes = {
  for: PropTypes.string,
  serverError: PropTypes.object
};

export default ServerValidationError;
