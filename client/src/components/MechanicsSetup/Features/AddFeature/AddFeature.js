import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import AddButton from '../../../UI/Form/Button/AddButton/AddButton';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';

import classes from './AddFeature.module.css';
import InlineSelect from '../../../UI/Form/Select/InlineSelect/InlineSelect';

const AddFeature = ({
  serverError,
  onValidateName,
  onSave,
  onCancel,
  featureTypes
}) => {
  const [adding, setAdding] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [typeValue, setTypeValue] = useState(null);

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
      setNameError('Feature with this name already exists');
      return;
    }

    setNameError(null);
    onSave(
      { name: nameValue, type: typeValue, description: descriptionValue },
      setSubmitted
    );
  }, [
    descriptionValue,
    nameValue,
    typeValue,
    onSave,
    onValidateName,
    setSubmitted
  ]);

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

  const handleTypeChanged = useCallback(newValue => {
    setTypeValue(newValue ? newValue.value : null);
  }, []);

  const featureTypeOptions = featureTypes.map(item => ({
    label: item,
    value: item
  }));
  return (
    <div className={classes.AddFeature}>
      {adding ? (
        <div className={classes.FeatureForm}>
          <ItemsRow>
            <ItemsRow className={classes.Inputs}>
              <InlineSelect
                isCreatable
                isClearable
                options={featureTypeOptions}
                onChange={handleTypeChanged}
                placeholder="Type"
                className={classes.Type}
              />

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
            </ItemsRow>
            <IconButton icon={faCheck} onClick={handleSave} className={classes.SaveButton} />
          </ItemsRow>
          {nameError ? <Error>{nameError}</Error> : null}
          {serverError ? (
            <ServerValidationError serverError={serverError} />
          ) : null}
          {serverError ? <ServerError serverError={serverError} /> : null}
        </div>
      ) : (
        <AddButton onClick={handleStartAdding} />
      )}
    </div>
  );
};

AddFeature.propTypes = {
  serverError: PropTypes.object,
  onValidateName: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func
};

const mapStateToProps = state => {
  return {
    featureTypes: state.feature.featureTypes
  };
};

export default connect(mapStateToProps)(AddFeature);
