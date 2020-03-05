import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../../../store/actions/index';

import AddFeature from './AddFeature/AddFeature';
import Feature from './Feature/Feature';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';

import classes from './Features.module.css';

const Features = props => {
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

  const handleAddFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(
        actions.addFeature(feature, props.isHomebrew, setSubmitted)
      );
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(
        actions.updateFeature(
          feature,
          props.isHomebrew,
          setSubmitted
        )
      );
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
    props.saveAllCallbacks.forEach(item => item.callback());
  }, [props.saveAllCallbacks]);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredFeatures(filteredItems);
  }, []);

  const fetching = props.isHomebrew ? props.fetchingHomebrew : props.fetchingShared;
  const fetchingError = props.isHomebrew ? props.errorHomebrew : props.errorShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <div className={classes.Features}>
        <AddFeature
          serverError={props.errors.ADD}
          onValidateName={validateName}
          onSave={handleAddFeature}
          onCancel={handleCancelChangingFeature}
        />

        <div className={classes.SearchRow}>
          <FilterInput
            allItems={allFeatures}
            onItemsFiltered={handleItemsFiltered}
          />
        </div>

        {filteredFeatures.map(feature => (
          <Feature
            key={feature._id}
            feature={feature}
            onSave={handleUpdateFeature}
            onValidateName={validateName}
            onDelete={handleDeleteFeature}
            onCancel={handleCancelChangingFeature}
            serverError={props.errors[feature._id]}
          />
        ))}
        <br />
        <IconButton icon={faCheck} onClick={handleSaveAll}>
          Save all
        </IconButton>
        <br />
        <br />
      </div>
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
    fetchingHomebrew: state.feature.fetchingHomebrew,
    saveAllCallbacks: state.feature.saveAllCallbacks
  };
};

export default connect(mapStateToProps)(Features);
