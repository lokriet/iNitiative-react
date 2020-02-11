import React, { useContext } from 'react';
import { ErrorMessage } from 'formik';
import ServerValidationError from '../../ServerValidationError/ServerValidationError';
import TextareaAutosize from 'react-textarea-autosize';
import classes from './InlineFormInput.module.css';
import { InlineFormContext } from '../InlineForm';

const InlineFormInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => {
  const { serverError, ...htmlProps } = { ...props };
  const context = useContext(InlineFormContext);

  const allClasses = [classes.InlineFormInput];
  if (context.isActive) {
    allClasses.push(classes.Active);
  } else {
    allClasses.push(classes.Inactive);
  }
  let input;
  if (props.type === 'textarea') {
    input = (
      <TextareaAutosize
        minRows={1}
        maxRows={12}
        className={allClasses.join(' ')}
        {...htmlProps}
        {...field}
      />
    );
  } else {
    input = (
      <input className={allClasses.join(' ')} onFocus={context.onFocus} {...htmlProps} {...field} />
    );
  }

  return (
    <div className={classes.InlineFormInputContainer}>
      {input}
      <ErrorMessage name={field.name} />
      {serverError ? (
        <ServerValidationError for={field.name} serverError={serverError} />
      ) : null}
    </div>
  );
};

export default InlineFormInput;