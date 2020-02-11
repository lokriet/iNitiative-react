import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import classes from './InlineForm.module.css';
import { useFormikContext } from 'formik';

const Status = {
  Open: 'Open',
  Closed: 'Closed',
  Submitting: 'Submitting'
};

const InlineForm = props => {
  const { isAddNew, ...htmlProps } = props;
  const [status, setStatus] = useState(Status.Closed);

  const { resetForm, handleSubmit, isSubmitting, isValid } = useFormikContext();

  const onFormFieldFocusedHandler = useCallback(() => {
    if (status === Status.Closed) {
      setStatus(Status.Open);
    }
  }, [status]);

  const children = props.children.map((element, index) => {
    return React.cloneElement(element, {
      key: index,
      isActive: status !== Status.Closed,
      onFocus: onFormFieldFocusedHandler
    });
  });

  const onCancelHandler = useCallback(() => {
    setStatus(Status.Closed);
    resetForm();
  }, [resetForm]);

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
    console.log('using effect...');
    if (status === Status.Submitting && !isSubmitting) {
      if (isValid) {
        setStatus(Status.Closed);
        resetForm();
      } else {
        setStatus(Status.Open);
      }
    }
  }, [status, isSubmitting, isValid, resetForm]);

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
        <div className={classes.Fields}>{children}</div>
      )}
      {buttons}
    </form>
  );
};

InlineForm.propTypes = {
  isAddNew: PropTypes.bool
};

export default InlineForm;
