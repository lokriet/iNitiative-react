import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import AddButton from '../../../UI/Form/Button/AddButton/AddButton';

import classes from './AddDamageType.module.css';

const AddDamageType = ({ serverError, onSave, onValidateName, onCancel }) => {
  const [adding, setAdding] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);

  const setSubmitted = useCallback(success => {
    if (success) {
      setAdding(false);
    }
  }, []);

  const handleStartAdding = useCallback(() => {
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
            onSave(value, setSubmitted);
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
    [onValidateName, onSave, setSubmitted, onCancel]
  );

  return (
    <div className={classes.AddDamageType}>
      {adding ? (
        <>
          <InlineInput
            hidingBorder
            type="text"
            onKeyDown={handleKeyDown}
            defaultValue=""
            placeholder="Name"
            autoFocus
          />
          {isNameValid ? null : <Error>Damage type with this name already exists</Error>}
          {serverError ? (
            <ServerValidationError serverError={serverError} />
          ) : null}
          {serverError ? <ServerError serverError={serverError} /> : null}
        </>
      ) : (
        <AddButton onClick={handleStartAdding} />
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
