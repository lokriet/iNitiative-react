import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../../../store/actions/index';
import AddFeature from './AddFeature/AddFeature';
import Feature from './Feature/Feature';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';
import classes from './Features.module.css';

const Features = props => {
  const dispatch = useDispatch();
  const allFeatures = props.isHomebrew
    ? props.homebrewFeatures
    : props.sharedFeatures;

  const [filteredFeatures, setFilteredFeatures] = useState(allFeatures);

  useEffect(() => {
    dispatch(actions.getSharedFeatures());
  }, [dispatch]);

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
        actions.addFeature(
          feature,
          props.isHomebrew,
          props.token,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew, props.token]
  );

  const handleUpdateFeature = useCallback(
    (feature, setSubmitted) => {
      dispatch(
        actions.updateFeature(
          feature,
          props.isHomebrew,
          props.token,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew, props.token]
  );

  const handleDeleteFeature = useCallback(
    featureId => {
      dispatch(actions.deleteFeature(featureId, props.token));
    },
    [dispatch, props.token]
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

  const handleItemsFiltered = useCallback(
    (filteredItems) => {
      setFilteredFeatures(filteredItems);
    },
    [],
  )

  let view;
  if (props.fetching) {
    view = <Spinner />;
  } else if (props.fetchingError) {
    view = <ServerError serverError={props.fetchingError} />;
  } else {
    view = (
      <div className={classes.Features}>
        <AddFeature
          serverError={props.errors.ADD}
          onValidateName={validateName}
          onSave={handleAddFeature}
          onCancel={handleCancelChangingFeature}
        />

        <FilterInput
          allItems={allFeatures}
          searchField='name'
          onItemsFiltered={handleItemsFiltered}
        />

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
    fetchingError: state.feature.error,
    fetching: state.feature.fetching,
    saveAllCallbacks: state.feature.saveAllCallbacks,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(Features);
