import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';

import { faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/InlineInput/InlineInput';
import IconButton from '../../../UI/Form/IconButton/IconButton';

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

  const setSubmitting = useCallback(submitting => {
    setShowSavedBadge(true);
    setTimeout(() => {
      setShowSavedBadge(false);
    }, 2000);
  }, []);

  const handleBlur = useCallback(
    event => {
      const value = event.target.value;
      if (!damageType || damageType.name !== value) {
        if (onValidateName(damageType ? damageType._id : null, value)) {
          setIsNameValid(true);
          onSave(damageType._id, event.target.value, setSubmitting);
        } else {
          setIsNameValid(false);
        }
      }
    },
    [damageType, setSubmitting, onSave, onValidateName]
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
      <div className={classes.InputRow}>
        <InlineInput
          type="text"
          name="name"
          defaultValue={damageType ? damageType.name : ''}
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

        <CSSTransition
          timeout={500}
          in={showSavedBadge}
          unmountOnExit
          classNames={{
            enter: classes.SavedBadgeEnter,
            enterActive: classes.SavedBadgeEnterActive,
            exit: classes.SavedBadgeExit,
            exitActive: classes.SavedBadgeExitActive
          }}
        >
          <span className={classes.SavedBadge}>Saved</span>
        </CSSTransition>
      </div>
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
