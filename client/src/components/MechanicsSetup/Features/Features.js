import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Prompt } from 'react-router';

import AddFeature from './AddFeature/AddFeature';
import Feature from './Feature/Feature';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';

import classes from './Features.module.css';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Popup from 'reactjs-popup';
import Button from '../../UI/Form/Button/Button';

import {
  fetchFeatures,
  addFeature,
  updateFeature,
  deleteFeature,
  removeFeatureError,
  selectors
} from './store/featureSlice';

const Features = ({ isHomebrew }) => {
  const [saveCallbacks, setSaveCallbacks] = useState({});
  const [changedFeatures, setChangedFeatures] = useState(new Set());

  const [deleting, setDeleting] = useState(false);
  const [deletingFeature, setDeletingFeature] = useState(null);

  const dispatch = useDispatch();
  const allFeatures = useSelector(
    isHomebrew ? selectors.selectHomebrew : selectors.selectShared
  );
  const fetching = useSelector((state) =>
    isHomebrew ? state.feature.homebrew.fetching : state.feature.shared.fetching
  );
  const fetchingError = useSelector((state) =>
    isHomebrew ? state.feature.homebrew.error : state.feature.shared.error
  );
  const errors = useSelector((state) =>
    isHomebrew
      ? state.feature.homebrew.errorsById
      : state.feature.shared.errorsById
  );
  const [filteredFeatures, setFilteredFeatures] = useState(allFeatures);

  useEffect(() => {
    dispatch(fetchFeatures(isHomebrew));
    if (isHomebrew) {
      // this is to get all the feature types for the dropdowns
      dispatch(fetchFeatures(!isHomebrew)); 
    }
  }, [dispatch, isHomebrew]);

  const validateName = useCallback(
    (_id, name) => {
      const result = !allFeatures.some(
        (item) => (_id == null || item._id !== _id) && item.name === name
      );
      return result;
    },
    [allFeatures]
  );

  const handleRegisterSaveCallback = useCallback((featureId, newCallback) => {
    setSaveCallbacks((previousSaveCallbacks) => ({
      ...previousSaveCallbacks,
      [featureId]: newCallback
    }));
  }, []);

  const handleUnregisterSaveCallback = useCallback((featureId) => {
    setSaveCallbacks((previousSaveCallbacks) => {
      let newCallbacks = { ...previousSaveCallbacks };
      delete newCallbacks[featureId];
      return newCallbacks;
    });
  }, []);

  const handleAddFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(addFeature(feature, isHomebrew, setSubmitted));
    },
    [dispatch, isHomebrew]
  );

  const handleUpdateFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(updateFeature(feature, isHomebrew, setSubmitted));
    },
    [dispatch, isHomebrew]
  );

  const handleDeleteFeatureClicked = useCallback(
    (feature) => {
      dispatch(removeFeatureError(feature._id, isHomebrew));
      setDeletingFeature(feature);
      setDeleting(true);
    },
    [dispatch, isHomebrew]
  );

  const handleDeleteFeatureCancelled = useCallback(() => {
    setDeletingFeature(null);
    setDeleting(false);
  }, []);

  const handleDeleteFeatureConfirmed = useCallback(() => {
    dispatch(deleteFeature(deletingFeature._id, isHomebrew));
    setDeletingFeature(null);
    setDeleting(false);
  }, [dispatch, deletingFeature, isHomebrew]);

  const handleCancelChangingFeature = useCallback(
    (featureId) => {
      dispatch(removeFeatureError(featureId, isHomebrew));
    },
    [dispatch, isHomebrew]
  );

  const handleSaveAll = useCallback(() => {
    for (let featureId in saveCallbacks) {
      saveCallbacks[featureId]();
    }
  }, [saveCallbacks]);

  const handleItemsFiltered = useCallback((filteredItems) => {
    setFilteredFeatures(filteredItems);
  }, []);

  const handleUnsavedChangesStateChange = useCallback(
    (featureId, hasUnsavedChanges) => {
      setChangedFeatures((previousChangedFeatures) => {
        const newChangedFeatures = new Set(previousChangedFeatures);
        if (hasUnsavedChanges) {
          newChangedFeatures.add(featureId);
        } else {
          newChangedFeatures.delete(featureId);
        }

        return newChangedFeatures;
      });
    },
    []
  );

  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <>
        <Prompt
          when={changedFeatures.size > 0}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
        <AddFeature
          serverError={errors.ADD}
          onValidateName={validateName}
          onSave={handleAddFeature}
          onCancel={handleCancelChangingFeature}
          isHomebrew={isHomebrew}
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

        {filteredFeatures.map((feature) => (
          <Feature
            key={feature._id}
            feature={feature}
            onSave={handleUpdateFeature}
            onValidateName={validateName}
            onDelete={handleDeleteFeatureClicked}
            onCancel={handleCancelChangingFeature}
            onRegisterSaveCallback={handleRegisterSaveCallback}
            onUnregisterSaveCallback={handleUnregisterSaveCallback}
            onHaveUnsavedChangesStateChange={handleUnsavedChangesStateChange}
            serverError={errors[feature._id]}
            isHomebrew={isHomebrew}
          />
        ))}

        <Popup
          open={deleting}
          modal
          closeOnDocumentClick={false}
          closeOnEscape={false}
          contentStyle={{ width: 'auto' }}
        >
          <div>
            <div>
              Delete feature {deletingFeature ? deletingFeature.name : ''}?
            </div>
            <br />
            <ItemsRow centered>
              <Button onClick={handleDeleteFeatureConfirmed}>Yes</Button>
              <Button onClick={handleDeleteFeatureCancelled}>No</Button>
            </ItemsRow>
          </div>
        </Popup>
      </>
    );
  }
  return view;
};

Features.propTypes = {
  isHomebrew: PropTypes.bool
};

export default Features;
