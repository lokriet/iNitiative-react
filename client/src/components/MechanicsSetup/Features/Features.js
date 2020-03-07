import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Prompt } from 'react-router';

import * as actions from '../../../store/actions/index';

import AddFeature from './AddFeature/AddFeature';
import Feature from './Feature/Feature';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';

import classes from './Features.module.css';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';

const Features = props => {
  const [saveCallbacks, setSaveCallbacks] = useState({});
  const [changedFeaturesCount, setChangedFeaturesCount] = useState(0);

  const dispatch = useDispatch();
  const allFeatures = props.isHomebrew
    ? props.homebrewFeatures
    : props.sharedFeatures;

  const [filteredFeatures, setFilteredFeatures] = useState(allFeatures);

  useEffect(() => {
    props.isHomebrew
      ? dispatch(actions.getHomebrewFeatures())
      : dispatch(actions.getSharedFeatures());
  }, [dispatch, props.isHomebrew]);

  const validateName = useCallback(
    (_id, name) => {
      const result = !allFeatures.some(
        item => (_id == null || item._id !== _id) && item.name === name
      );
      return result;
    },
    [allFeatures]
  );

  const handleRegisterSaveCallback = useCallback((featureId, newCallback) => {
    setSaveCallbacks(previousSaveCallbacks => ({
      ...previousSaveCallbacks,
      [featureId]: newCallback
    }));
  }, []);

  const handleUnregisterSaveCallback = useCallback(featureId => {
    setSaveCallbacks(previousSaveCallbacks => {
      let newCallbacks = { ...previousSaveCallbacks };
      delete newCallbacks[featureId];
      return newCallbacks;
    });
  }, []);

  const handleAddFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(actions.addFeature(feature, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(actions.updateFeature(feature, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleDeleteFeature = useCallback(
    featureId => {
      dispatch(actions.deleteFeature(featureId));
    },
    [dispatch]
  );

  const handleCancelChangingFeature = useCallback(
    featureId => {
      dispatch(actions.removeFeatureError(featureId));
    },
    [dispatch]
  );

  const handleSaveAll = useCallback(() => {
    for (let featureId in saveCallbacks) {
      saveCallbacks[featureId]();
    }
  }, [saveCallbacks]);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredFeatures(filteredItems);
  }, []);

  const handleUnsavedChangesStateChange = useCallback(hasUnsavedChanges => {
    setChangedFeaturesCount(previousChangedFeaturesCount => {
      const result = hasUnsavedChanges
        ? previousChangedFeaturesCount + 1
        : previousChangedFeaturesCount - 1;
      return result;
    });
  }, []);

  const fetching = props.isHomebrew
    ? props.fetchingHomebrew
    : props.fetchingShared;
  const fetchingError = props.isHomebrew
    ? props.errorHomebrew
    : props.errorShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <>
        <Prompt
          when={changedFeaturesCount > 0}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
        <AddFeature
          serverError={props.errors.ADD}
          onValidateName={validateName}
          onSave={handleAddFeature}
          onCancel={handleCancelChangingFeature}
        />

        <ItemsRow centered alignCentered className={classes.SearchRow}>
          <div>
            <FilterInput
              allItems={allFeatures}
              onItemsFiltered={handleItemsFiltered}
            />
          </div>
          <IconButton icon={faCheck} onClick={handleSaveAll}>
            Save all changes
          </IconButton>
        </ItemsRow>

        {filteredFeatures.map(feature => (
          <Feature
            key={feature._id}
            feature={feature}
            onSave={handleUpdateFeature}
            onValidateName={validateName}
            onDelete={handleDeleteFeature}
            onCancel={handleCancelChangingFeature}
            onRegisterSaveCallback={handleRegisterSaveCallback}
            onUnregisterSaveCallback={handleUnregisterSaveCallback}
            onHaveUnsavedChangesStateChange={handleUnsavedChangesStateChange}
            serverError={props.errors[feature._id]}
          />
        ))}
      </>
    );
  }
  return view;
};

Features.propTypes = {
  isHomebrew: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    homebrewFeatures: state.feature.homebrewFeatures,
    sharedFeatures: state.feature.sharedFeatures,
    errors: state.feature.errors,
    errorShared: state.feature.errorShared,
    errorHomebrew: state.feature.errorHomebrew,
    fetchingShared: state.feature.fetchingShared,
    fetchingHomebrew: state.feature.fetchingHomebrew
  };
};

export default connect(mapStateToProps)(Features);
