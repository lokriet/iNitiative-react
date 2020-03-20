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
import Popup from 'reactjs-popup';
import Button from '../../UI/Form/Button/Button';

const Features = props => {
  const [saveCallbacks, setSaveCallbacks] = useState({});
  const [changedFeatures, setChangedFeatures] = useState(new Set());

  const [deleting, setDeleting] = useState(false);
  const [deletingFeature, setDeletingFeature] = useState(null);

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

  const handleDeleteFeatureClicked = useCallback(
    feature => {
      dispatch(actions.removeFeatureError(feature._id));
      setDeletingFeature(feature);
      setDeleting(true);
    },
    [dispatch]
  );

  const handleDeleteFeatureCancelled = useCallback(() => {
    setDeletingFeature(null);
    setDeleting(false);
  }, []);

  const handleDeleteFeatureConfirmed = useCallback(() => {
    dispatch(actions.deleteFeature(deletingFeature._id));
    setDeletingFeature(null);
    setDeleting(false);
  }, [dispatch, deletingFeature]);

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

  const handleUnsavedChangesStateChange = useCallback(
    (featureId, hasUnsavedChanges) => {
      setChangedFeatures(previousChangedFeatures => {
        const newChangedFeatures = new Set(previousChangedFeatures);
        if (hasUnsavedChanges) {
          newChangedFeatures.add(featureId);
        } else {
          newChangedFeatures.delete(featureId);
        }

        console.log('new changes count', newChangedFeatures.size);

        return newChangedFeatures;
      });
    },
    []
  );

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
          when={changedFeatures.size > 0}
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
            onDelete={handleDeleteFeatureClicked}
            onCancel={handleCancelChangingFeature}
            onRegisterSaveCallback={handleRegisterSaveCallback}
            onUnregisterSaveCallback={handleUnregisterSaveCallback}
            onHaveUnsavedChangesStateChange={hasUnsavedChanges =>
              handleUnsavedChangesStateChange(
                feature._id.toString(),
                hasUnsavedChanges
              )
            }
            serverError={props.errors[feature._id]}
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
              Delete feature {deletingFeature ? deletingFeature.name : ''}
              ?
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
