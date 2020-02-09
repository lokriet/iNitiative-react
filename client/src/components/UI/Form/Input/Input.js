import React, { Fragment } from 'react';
import {ErrorMessage} from 'formik';
import ServerValidationError from '../ServerValidationError/ServerValidationError';
import classes from './Input.module.css';

const Input =  ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
})  => {
  const {serverError, ...htmlProps} = {...props}
  return (
    <Fragment>
      <input className={classes.Input} {...htmlProps}  {...field}  />
      <ErrorMessage name={field.name} />
      {serverError ? <ServerValidationError for={field.name} serverError={serverError} /> : null }
    </Fragment>
  );
};

export default Input;
