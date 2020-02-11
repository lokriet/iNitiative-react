import React, { useState, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import ServerValidationError from '../../../UI/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/ServerError/ServerError';
import classes from './AddDamageType.module.css';

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
      if (event.keyCode === 13) { // enter
        const value = event.target.value;
        if (value !== '') {
          if (onValidateName(null, value)) {
            setIsNameValid(true);
            onSave(value, setSubmitting);
          } else {
            setIsNameValid(false);
          }
        }
      } else if (event.keyCode === 27) { //esc
        setAdding(false);
        setIsNameValid(true);
        onCancel();
      }
    },
    [onValidateName, onSave, setSubmitting, onCancel]
  );

  return (
    <div className={classes.AddDamageType}>
      {adding ? (
        <Fragment>
          <div>
            <input
              type="text"
              className={classes.Input}
              onKeyDown={handleKeyDown}
              defaultValue=""
              ref={inputRef => inputRef && inputRef.focus()}
            />
          </div>
          {isNameValid ? null : (
            <div className={classes.Error}>Damage type already exists</div>
          )}
          {serverError ? (
            <ServerValidationError serverError={serverError} />
          ) : null}
          {serverError ? <ServerError serverError={serverError} /> : null}
        </Fragment>
      ) : (
        <button
          type="button"
          className={classes.Button}
          onClick={startAddingHandler}
        >
          <FontAwesomeIcon icon={faPlus} className={classes.AddIcon} />
          Add new
        </button>
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
