import React, { useState, useCallback, Fragment } from 'react';
import PropTypes from 'prop-types';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import CreatableSelect from 'react-select/creatable';

import ServerValidationError from '../../../UI/Errors/ServerValidationError/ServerValidationError';
import ServerError from '../../../UI/Errors/ServerError/ServerError';
import Error from '../../../UI/Errors/Error/Error';
import InlineInput from '../../../UI/Form/InlineInput/InlineInput';
import { AddButton } from '../../../UI/Form/AddButton/AddButton';
import ItemsRow from '../../../UI/ItemsRow/ItemsRow';
import IconButton from '../../../UI/Form/IconButton/IconButton';

import classes from './AddFeature.module.css';
import { connect } from 'react-redux';

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
      setNameError('Feature already exists');
      return;
    }

    setNameError(null);
    onSave({ name: nameValue, type: typeValue, description: descriptionValue }, setSubmitted);
  }, [descriptionValue, nameValue, typeValue, onSave, onValidateName, setSubmitted]);

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

  const handleTypeChanged = useCallback((newValue) => {
    setTypeValue(newValue ? newValue.value : null);
  }, []);

  const featureTypeOptions = featureTypes.map(item => ({label: item, value: item}));
  return (
    <div className={classes.AddFeature}>
      {adding ? (
        <Fragment>
          <ItemsRow centered>
            <CreatableSelect
              options={featureTypeOptions}
              onChange={handleTypeChanged}
              isClearable={true}
              placeholder='Type'
              className='AddFeatureTypeContainer'
              classNamePrefix='AddFeatureType'
            />

            <InlineInput
              className={classes.Name}
              type="text"
              onKeyDown={handleKeyDown}
              onChange={handleNameChanged}
              defaultValue=""
              placeholder="Name"
              autoFocus
            />
            <InlineInput
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
