import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import ErrorType from '../../../util/error';
import classes from './InlineForm.module.css';
import { useFormikContext } from 'formik';

const Status = {
  Open: 'Open',
  Closed: 'Closed',
  Submitting: 'Submitting'
};

export const InlineFormContext = React.createContext();

const InlineForm = props => {
  const { isAddNew, onCancelEdit, serverError, ...htmlProps } = props;
  const [status, setStatus] = useState(Status.Closed);

  const { resetForm, handleSubmit, isSubmitting, isValid } = useFormikContext();

  const onFormFieldFocusedHandler = useCallback(() => {
    if (status === Status.Closed) {
      setStatus(Status.Open);
    }
  }, [status]);

  const onCancelHandler = useCallback(() => {
    setStatus(Status.Closed);
    resetForm();
    onCancelEdit();
  }, [resetForm, onCancelEdit]);

  const onSubmitHandler = useCallback(
    event => {
      event.preventDefault();
      setStatus(Status.Submitting);
      handleSubmit(event);
    },
    [handleSubmit]
  );

  const onAddNewHandler = useCallback(event => {
    event.preventDefault();
    setStatus(Status.Open);
  }, []);

  useEffect(() => {
    if (status === Status.Submitting && !isSubmitting) {
      if (isValid && !serverError) {
        setStatus(Status.Closed);
        resetForm();
      } else {
        setStatus(Status.Open);
      }
    }
  }, [status, isSubmitting, isValid, resetForm, serverError]);

  let buttons = null;
  if (status === Status.Open) {
    buttons = (
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancelHandler}>
          Cancel
        </button>
      </div>
    );
  } else if (status === Status.Closed && isAddNew) {
    buttons = (
      <div>
        <button type="button" onClick={onAddNewHandler}>
          Add new
        </button>
      </div>
    );
  } else if (status === Status.Submitting) {
    buttons = <Spinner />;
  }

  let operationErrorMessage = null;
  if (serverError && serverError.type !== ErrorType.VALIDATION_ERROR) {
    operationErrorMessage = <div>{serverError.message}</div>;
  }

  const classesList = [classes.InlineForm];
  if (status !== Status.Closed) {
    classesList.push(classes.Active);
  }
  return (
    <form
      {...htmlProps}
      onSubmit={onSubmitHandler}
      className={classesList.join(' ')}
    >
      {isAddNew && status === Status.Closed ? null : (
        <div className={classes.Fields}>
          <InlineFormContext.Provider
            value={{
              isActive: status !== Status.Closed,
              onFocus: onFormFieldFocusedHandler
            }}
          >
            {props.children}
          </InlineFormContext.Provider>
        </div>
      )}
      {operationErrorMessage}
      {buttons}
    </form>
  );
};

InlineForm.propTypes = {
  isAddNew: PropTypes.bool,
  onCancelEdit: PropTypes.func
};

export default InlineForm;
