import React, { useState, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import { AddButton } from '../../../UI/Form/Button/AddButton/AddButton';

import classes from './AddCondition.module.css';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const AddCondition = ({ serverError, onValidateName, onSave, onCancel }) => {
  const [adding, setAdding] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  const handleStartAdding = useCallback(() => {
    setAdding(true);
  }, []);

  const setSubmitted = useCallback(success => {
    if (success) {
      setAdding(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (nameValue.trim() === '') {
      setNameError('Name is required');
      return;
    }
    if (!onValidateName(null, nameValue)) {
      setNameError('Condition already exists');
      return;
    }

    setNameError(null);
    onSave({ name: nameValue, description: descriptionValue }, setSubmitted);
  }, [descriptionValue, nameValue, onSave, onValidateName, setSubmitted]);

  const handleKeyDown = useCallback(
    event => {
      if (event.keyCode === 27) {
        //esc
        setAdding(false);
        setNameError(null);
        onCancel(null);
      }
    },
    [onCancel]
  );

  const handleNameChanged = useCallback(event => {
    setNameValue(event.target.value);
  }, []);

  const handleDescriptionChanged = useCallback(event => {
    setDescriptionValue(event.target.value);
  }, []);

  return (
    <div className={classes.AddCondition}>
      {adding ? (
        <Fragment>
          <ItemsRow centered>
            <InlineInput
              hidingBorder
              className={classes.Name}
              type="text"
              onKeyDown={handleKeyDown}
              onChange={handleNameChanged}
              defaultValue=""
              placeholder="Name"
              autoFocus
            />
            <InlineInput
              hidingBorder
              className={classes.Description}
              inputType="textarea"
              onKeyDown={handleKeyDown}
              onChange={handleDescriptionChanged}
              defaultValue=""
              placeholder="Description"
            />
            <IconButton icon={faCheck} onClick={handleSave} />
          </ItemsRow>
          {nameError ? <Error>{nameError}</Error> : null}
          {serverError ? (
            <ServerValidationError serverError={serverError} />
          ) : null}
          {serverError ? <ServerError serverError={serverError} /> : null}
        </Fragment>
      ) : (
        <AddButton onClick={handleStartAdding} />
      )}
    </div>
  );
};

AddCondition.propTypes = {
  serverError: PropTypes.object,
  onValidateName: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

export default AddCondition;
