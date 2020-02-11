import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import ServerValidationError from '../../../UI/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/ServerError/ServerError';
import classes from './DamageType.module.css';
import { CSSTransition } from 'react-transition-group';

const DamageType = ({
  damageType,
  onSave,
  onValidateName,
  serverError
}) => {
  const [isNameValid, setIsNameValid] = useState(true);
  const [showSavedBadge, setShowSavedBadge] = useState(false);

  const setSubmitting = useCallback(submitting => {
    setShowSavedBadge(true);
    setTimeout(() => {
      setShowSavedBadge(false);
    }, 2000);
  }, []);

  const handleKeyPress = useCallback((event) => {
    if(event.key === 'Enter'){
      event.target.blur();
    }
  }, []);

  const handleBlur = useCallback((event) => {
    const value = event.target.value;
    if (!damageType || damageType.name !== value) {
      if (onValidateName(damageType ? damageType._id : null, value)) {
        setIsNameValid(true);
        onSave(damageType._id, event.target.value, setSubmitting);
      } else {
        setIsNameValid(false);
      }
    }
  }, [damageType, setSubmitting, onSave, onValidateName]);

  return (
    <div className={classes.DamageType}>
      <div className={classes.InputRow}>
        <input
          type="text"
          name="name"
          defaultValue={damageType ? damageType.name : ''}
          className={classes.Input}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
        />
        <button type="button" className={classes.Button}>X</button>
        
          <CSSTransition timeout={500} in={showSavedBadge} unmountOnExit classNames={{
            enter: classes.SavedBadgeEnter,
            enterActive: classes.SavedBadgeEnterActive,
            exit: classes.SavedBadgeExit,
            exitActive: classes.SavedBadgeExitActive
            }}>
            <span className={classes.SavedBadge}>Saved</span>
          </CSSTransition>
        
      </div>
      {isNameValid ? null : <div className={classes.Error}>Damage type already exists</div>}
      {serverError ? <ServerValidationError serverError={serverError} /> : null}
      {serverError ? <ServerError serverError={serverError} /> : null}
    </div>
  );
};

DamageType.propTypes = {
  damageType: PropTypes.object, 
  onSave: PropTypes.func,
  onValidateName: PropTypes.func,
  serverError: PropTypes.object
};

export default DamageType;
