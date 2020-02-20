import React from 'react';
import {ErrorMessage} from 'formik';
import ServerValidationError from '../../../Errors/ServerValidationError/ServerValidationError';
import classes from './FormikInput.module.css';
import InlineInput from '../InlineInput/InlineInput';

const Input =  ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
})  => {
  const {serverError, className, ...htmlProps} = props;

  return (
    <div className={classes.InputContainer}>
      <InlineInput className={className} {...htmlProps} {...field}  />
      <div className={classes.ValidationError}><ErrorMessage name={field.name} /></div>
      {serverError ? <ServerValidationError for={field.name} serverError={serverError} /> : null }
    </div>
  );
};

export default Input;
