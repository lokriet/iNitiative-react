import React, { useState, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/InlineInput/InlineInput';

import classes from './AddDamageType.module.css';
import { AddButton } from '../../../UI/Form/AddButton/AddButton';

const AddDamageType = ({ serverError, onSave, onValidateName, onCancel }) => {
  const [adding, setAdding] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);

  const setSubmitting = useCallback(() => {
    setAdding(false);
  }, []);

  const startAddingHandler = useCallback(() => {
    setAdding(true);
  }, []);

  const handleKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        // enter
        const value = event.target.value;
        if (value !== '') {
          if (onValidateName(null, value)) {
            setIsNameValid(true);
            onSave(value, setSubmitting);
          } else {
            setIsNameValid(false);
          }
        }
      } else if (event.keyCode === 27) {
        //esc
        setAdding(false);
        setIsNameValid(true);
        onCancel(null);
      }
    },
    [onValidateName, onSave, setSubmitting, onCancel]
  );

  return (
    <div className={classes.AddDamageType}>
      {adding ? (
        <Fragment>
          <div>
            <InlineInput
              type="text"
              onKeyDown={handleKeyDown}
              defaultValue=""
              ref={inputRef => inputRef && inputRef.focus()}
            />
          </div>
          {isNameValid ? null : <Error>Damage type already exists</Error>}
          {serverError ? (
            <ServerValidationError serverError={serverError} />
          ) : null}
          {serverError ? <ServerError serverError={serverError} /> : null}
        </Fragment>
      ) : (
        <AddButton onClick={startAddingHandler} />
      )}
    </div>
  );
};

AddDamageType.propTypes = {
  serverError: PropTypes.object,
  onValidateName: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

export default AddDamageType;
