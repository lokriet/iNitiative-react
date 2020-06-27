import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  faTimes,
  faCheck,
  faUndoAlt,
  faFish
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InlineInput from '../../../UI/Form/Input/InlineInput/InlineInput';
import IconButton from '../../../UI/Form/Button/IconButton/IconButton';
import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import SavedBadge from '../../../UI/SavedBadge/SavedBadge';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import InlineSelect from '../../../UI/Form/Select/InlineSelect/InlineSelect';

import classes from './Feature.module.css';
import { useSelector } from 'react-redux';
import { selectors } from '../store/featureSlice';

const Feature = ({
  feature,
  serverError,
  onValidateName,
  onSave,
  onCancel,
  onDelete,
  onRegisterSaveCallback,
  onUnregisterSaveCallback,
  onHaveUnsavedChangesStateChange,
  isHomebrew
}) => {
  const [nameValue, setNameValue] = useState(feature.name);
  const [descriptionValue, setDescriptionValue] = useState(feature.description);
  const [typeValue, setTypeValue] = useState(
    !feature.type || feature.type.length === 0
      ? null
      : { label: feature.type, value: feature.type }
  );
  const [nameError, setNameError] = useState(null);
  const [showSavedBadge, setShowSavedBadge] = useState(false);
  const [showSaveButtons, setShowSaveButtons] = useState(false);

  const featureTypes = useSelector(isHomebrew
      ? selectors.common.selectAllFeatureTypes
      : selectors.common.selectSharedFeatureTypes
  );

  const handleHaveUnsavedChanges = useCallback(
    (haveUnsavedChanges) => {
      onHaveUnsavedChangesStateChange(feature._id.toString(), haveUnsavedChanges)
    },
    [onHaveUnsavedChangesStateChange, feature._id],
  )

  const setSubmitted = useCallback((success) => {
    if (success) {
      setShowSavedBadge(true);
      setShowSaveButtons(false);
      handleHaveUnsavedChanges(false);
    }
  }, [handleHaveUnsavedChanges]);

  const handleHideSavedBadge = () => {
    setShowSavedBadge(false);
  };

  const getTypeValueValue = (typeValue) => {
    return typeValue == null ? null : typeValue.value;
  };

  const handleNameChanged = (event) => {
    setNameValue(event.target.value);
    if (
      event.target.value !== feature.name ||
      descriptionValue !== feature.description ||
      getTypeValueValue(typeValue) !== feature.type
    ) {
      if (!showSaveButtons) {
        handleHaveUnsavedChanges(true);
      }
      setShowSaveButtons(true);
    } else if (!serverError) {
      if (showSaveButtons) {
        handleHaveUnsavedChanges(false);
      }
      setShowSaveButtons(false);
    }
  };

  const handleDescriptionChanged = (event) => {
    setDescriptionValue(event.target.value);

    if (
      nameValue !== feature.name ||
      event.target.value !== feature.description ||
      getTypeValueValue(typeValue) !== feature.type
    ) {
      if (!showSaveButtons) {
        handleHaveUnsavedChanges(true);
      }
      setShowSaveButtons(true);
    } else {
      if (showSaveButtons) {
        handleHaveUnsavedChanges(false);
      }
      setShowSaveButtons(false);
    }
  };

  const handleTypeChanged = (newValue, action) => {
    setTypeValue(newValue);

    if (
      nameValue !== feature.name ||
      descriptionValue !== feature.description ||
      getTypeValueValue(newValue) !== feature.type
    ) {
      setShowSaveButtons(true);
      handleHaveUnsavedChanges(true);
    } else {
      setShowSaveButtons(false);
      handleHaveUnsavedChanges(false);
    }
  };

  const handleSave = useCallback(() => {
    if (!showSaveButtons) {
      return;
    }

    if (nameValue.trim() === '') {
      setNameError('Name is required');
      return;
    }
    if (!onValidateName(feature._id, nameValue)) {
      setNameError('Feature already exists');
      return;
    }

    setNameError(null);
    onSave(
      {
        _id: feature._id,
        name: nameValue,
        description: descriptionValue,
        type: getTypeValueValue(typeValue)
      },
      setSubmitted
    );
  }, [showSaveButtons, nameValue, descriptionValue, typeValue, feature._id, onValidateName, onSave, setSubmitted]);

  const handleCancel = () => {
    setNameError(null);
    setShowSaveButtons(false);
    setNameValue(feature.name);
    setTypeValue(
      !feature.type || feature.type.length === 0
        ? null
        : { label: feature.type, value: feature.type }
    );
    setDescriptionValue(feature.description);
    handleHaveUnsavedChanges(false);

    onCancel(feature._id);
  };
  
  useEffect(() => {
    onRegisterSaveCallback(feature._id, handleSave);
    return () => {
      onUnregisterSaveCallback(feature._id);
    };
  }, [feature._id, handleSave, onRegisterSaveCallback, onUnregisterSaveCallback]);


  const featureTypeOptions = featureTypes.map((item) => ({
    label: item,
    value: item
  }));

  return (
    <div className={classes.Feature}>
      <div className={classes.FeatureForm}>
        <ItemsRow className={classes.InputFieldsRow}>
          <InlineSelect
            options={featureTypeOptions}
            onChange={handleTypeChanged}
            isClearable
            isCreatable
            isObjectBased={false}
            placeholder="Type"
            className={classes.Type}
            value={typeValue}
          />

          <InlineInput
            hidingBorder
            type="text"
            name="name"
            placeholder="Name"
            value={nameValue}
            onChange={handleNameChanged}
            className={classes.Name}
          />
          <InlineInput
            hidingBorder
            className={classes.Description}
            inputType="textarea"
            name="description"
            placeholder="Description"
            value={descriptionValue}
            onChange={handleDescriptionChanged}
          />
          <IconButton
            icon={faTimes}
            onClick={() => onDelete(feature)}
          />
          <ItemsRow className={classes.SaveButtons}>
            {showSaveButtons ? (
              <>
                <IconButton icon={faCheck} onClick={handleSave} />
                <IconButton icon={faUndoAlt} onClick={handleCancel} />
              </>
            ) : null}
          </ItemsRow>
        </ItemsRow>
        <SavedBadge
          show={showSavedBadge}
          onHide={handleHideSavedBadge}
        />
        {nameError ? <Error>{nameError}</Error> : null}
        {serverError ? (
          <ServerValidationError serverError={serverError} />
        ) : null}
        {serverError ? (
          <ServerError serverError={serverError} />
        ) : null}
      </div>

      <br />
      <ItemsRow>
        <FontAwesomeIcon
          icon={faFish}
          className={classes.Fish}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faFish}
          flip={'horizontal'}
          className={classes.Fish}
        ></FontAwesomeIcon>
        <FontAwesomeIcon
          icon={faFish}
          flip={'horizontal'}
          className={classes.Fish}
        ></FontAwesomeIcon>
      </ItemsRow>
    </div>
  );
};


Feature.propTypes = {
  feature: PropTypes.object.isRequired,
  serverError: PropTypes.object,
  onValidateName: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onRegisterSaveCallback: PropTypes.func.isRequired,
  onUnregisterSaveCallback: PropTypes.func.isRequired,
  onHaveUnsavedChangesStateChange: PropTypes.func.isRequired
};

export default Feature;
