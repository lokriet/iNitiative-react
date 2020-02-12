import React from 'react';
import {ErrorMessage} from 'formik';
import ServerValidationError from '../../Errors/ServerValidationError/ServerValidationError';
import classes from './FormikInput.module.css';

const Input =  ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
})  => {
  const {serverError, ...htmlProps} = {...props}
  return (
    <div className={classes.InputContainer}>
      <input className={classes.Input} {...htmlProps}  {...field}  />
      <ErrorMessage name={field.name} />
      {serverError ? <ServerValidationError for={field.name} serverError={serverError} /> : null }
    </div>
  );
};

export default Input;
