import React, { useCallback, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { faTimes, faUndoAlt } from '@fortawesome/free-solid-svg-icons';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';

import classes from './DamageType.module.css';
import Color from '../../../UI/Color/Color';
import Popup from 'reactjs-popup';
import ColorPicker from '../../../UI/Color/ColorPicker/ColorPicker';

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
  }, []);

  const handleBlur = useCallback(
    event => {
      const value = event.target.value;
      if (!damageType || damageType.name !== value) {
        if (onValidateName(damageType ? damageType._id : null, value)) {
          setIsNameValid(true);
          onSave(damageType, {name: event.target.value}, setSubmitted);
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

  const handleKeyDown = useCallback(
    event => {
      if (event.keyCode === 13) {
        // enter
        event.target.blur();
      } else if (event.keyCode === 27) {
        // escape
        handleCancel();
        event.target.blur();
      }
    },
    [handleCancel]
  );

  const handleColorChange = useCallback(
    (close, newColor) => {
      onSave(damageType, {color: newColor}, setSubmitted);
      close();
    },
    [damageType, onSave, setSubmitted],
  )

  useEffect(() => {
    if (serverError || !isNameValid) {
      setShowCancelButton(true);
    } else {
      setShowCancelButton(false);
    }
  }, [serverError, isNameValid]);

  return (
    <div className={classes.DamageType}>
      <div style={{ position: 'relative' }}>
        <ItemsRow alignCentered>
          <Popup
            on="click"
            trigger={open => (
              <div className={classes.ColorButton}>
                <Color color={damageType.color} />
              </div>
            )}
            offsetY={10}
            contentStyle={{ width: 'auto' }}
          >
            {close => (
              <ColorPicker
                selectedColor={damageType.color}
                onSelected={newColor => handleColorChange(close, newColor)}
                onCancel={close}
              />
            )}
          </Popup>

          <InlineInput
            hidingBorder
            className={classes.NameInput}
            type="text"
            name="name"
            placeholder="Name"
            defaultValue={damageType ? damageType.name : ''}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={nameRef}
          />
          <IconButton onClick={() => onDelete(damageType)} icon={faTimes} />

          <div className={classes.CancelButton}>
            {showCancelButton ? (
              <IconButton onClick={handleCancel} icon={faUndoAlt} />
            ) : null}
          </div>
        </ItemsRow>
        <SavedBadge show={showSavedBadge} onHide={handleHideSavedBadge} />
      </div>
      {isNameValid ? null : (
        <Error>Damage type with this name already exists</Error>
      )}
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
