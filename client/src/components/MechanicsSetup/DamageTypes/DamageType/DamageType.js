import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/InlineInput/InlineInput';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/IconButton/IconButton';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';

import classes from './DamageType.module.css';

const DamageType = ({
  damageType,
  onSave,
  onDelete,
  onCancel,
  onValidateName,
  serverError
}) => {
  const [isNameValid, setIsNameValid] = useState(true);
  const [showSavedBadge, setShowSavedBadge] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);

  const nameRef = useRef();

  const setSubmitted = useCallback(success => {
    if (success) {
      setShowSavedBadge(true);
    }
  }, []);

  const handleHideSavedBadge = useCallback(() => {
    setShowSavedBadge(false);
  }, [])

  const handleBlur = useCallback(
    event => {
      const value = event.target.value;
      if (!damageType || damageType.name !== value) {
        if (onValidateName(damageType ? damageType._id : null, value)) {
          setIsNameValid(true);
          onSave(damageType._id, event.target.value, setSubmitted);
        } else {
          setIsNameValid(false);
        }
      }
    },
    [damageType, setSubmitted, onSave, onValidateName]
  );

  const handleCancel = useCallback(() => {
    nameRef.current.value = damageType.name;
    setIsNameValid(true);
    onCancel(damageType._id);
  }, [damageType, onCancel]);

  const handleKeyDown = useCallback(event => {
    if (event.keyCode === 13) {
      // enter
      event.target.blur();
    } else if (event.keyCode === 27) {
      // escape
      handleCancel();
      event.target.blur();
    }
  }, [handleCancel]);

  useEffect(() => {
    if (serverError || !isNameValid) {
      setShowCancelButton(true);
    } else {
      setShowCancelButton(false);
    }
  }, [serverError, isNameValid]);

  return (
    <div className={classes.DamageType}>
      <ItemsRow>
        <InlineInput
          type="text"
          name="name"
          placeholder="Name"
          defaultValue={damageType ? damageType.name : ""}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          ref={nameRef}
        />
        <IconButton onClick={() => onDelete(damageType._id)} icon={faTimes} />

        {showCancelButton ? (
          <IconButton onClick={handleCancel} icon={faUndoAlt} />
        ) : (
          <div className={classes.Placeholder}></div>
        )}

        <SavedBadge show={showSavedBadge} onHide={handleHideSavedBadge} />
      </ItemsRow>
      {isNameValid ? null : <Error>Damage type already exists</Error>}
      {serverError ? <ServerValidationError serverError={serverError} /> : null}
      {serverError ? <ServerError serverError={serverError} /> : null}
    </div>
  );
};

DamageType.propTypes = {
  damageType: PropTypes.object,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  onCancel: PropTypes.func,
  onValidateName: PropTypes.func,
  serverError: PropTypes.object
};

export default DamageType;
