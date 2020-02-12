import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ErrorType from '../../../../util/error';

const ServerValidationError = props => {
  let errors = null;

  if (
    props.serverError &&
    props.serverError.type === ErrorType.VALIDATION_ERROR &&
    props.serverError.data &&
    props.serverError.data.length > 0
  ) {
    const myErrors = props.for ? props.serverError.data.filter(
      error => error.param === props.for
      ) : props.serverError.data;
    if (myErrors.length > 0) {
      errors = (
        <Fragment>
          {myErrors.map((error, index) => (
            <div className={props.className} key={index}>{error.msg}</div>
          ))}
        </Fragment>
      );
    }
  }
  return errors;
};

ServerValidationError.propTypes = {
  for: PropTypes.string,
  serverError: PropTypes.object,
  className: PropTypes.string
};

export default ServerValidationError;
