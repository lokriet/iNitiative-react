import React from 'react';
import PropTypes from 'prop-types';
import ErrorType from '../../../../util/error';
import Error from '../Error/Error';

const ServerError = props => {
  let errors = null;

  if (
    props.serverError &&
    props.serverError.type !== ErrorType.VALIDATION_ERROR
  ) {
    errors = <Error className={props.className}>{props.serverError.message}</Error>;
  }
  return errors;
};

ServerError.propTypes = {
  serverError: PropTypes.object,
  className: PropTypes.string
};

export default ServerError;
