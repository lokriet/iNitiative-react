import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import * as actions from '../../../store/actions/index';

import AddCondition from './AddCondition/AddCondition';
import Condition from './Condition/Condition';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';

import classes from './Conditions.module.css';

const Conditions = props => {
  const dispatch = useDispatch();
  const allConditions = props.isHomebrew
    ? props.homebrewConditions
    : props.sharedConditions;

  const [filteredConditions, setFilteredConditions] = useState(allConditions);

  useEffect(() => {
    props.isHomebrew
      ? dispatch(actions.getHomebrewConditions())
      : dispatch(actions.getSharedConditions());
  }, [dispatch, props.isHomebrew]);

  const validateName = useCallback(
    (_id, name) => {
      const result = !allConditions.some(
        item => (_id == null || item._id !== _id) && item.name === name
      );
      return result;
    },
    [allConditions]
  );

  const handleAddCondition = useCallback(
    (condition, setSubmitted) => {
      dispatch(
        actions.addCondition(
          condition,
          props.isHomebrew,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateCondition = useCallback(
    (condition, setSubmitted) => {
      dispatch(
        actions.updateCondition(
          condition,
          props.isHomebrew,
          setSubmitted
        )
      );
    },
    [dispatch, props.isHomebrew]
  );

  const handleDeleteCondition = useCallback(
    conditionId => {
      dispatch(actions.deleteCondition(conditionId));
    },
    [dispatch]
  );

  const handleCancelChangingCondition = useCallback(
    conditionId => {
      dispatch(actions.removeConditionError(conditionId));
    },
    [dispatch]
  );

  const handleSaveAll = useCallback(() => {
    props.saveAllCallbacks.forEach(item => item.callback());
  }, [props.saveAllCallbacks]);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredConditions(filteredItems);
  }, []);


  const fetchingError = props.isHomebrew ? props.fetchingHomebrewError : props.fetchingSharedError;
  const fetching = props.isHomebrew ? props.fetchingHomebrew : props.fetchingShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <div className={classes.Conditions}>
        <AddCondition
          serverError={props.errors.ADD}
          onValidateName={validateName}
          onSave={handleAddCondition}
          onCancel={handleCancelChangingCondition}
        />

        <div className={classes.SearchRow}>
          <FilterInput
            allItems={allConditions}
            searchField="name"
            onItemsFiltered={handleItemsFiltered}
          />
        </div>

        {filteredConditions.map(condition => (
          <Condition
            key={condition._id}
            condition={condition}
            onSave={handleUpdateCondition}
            onValidateName={validateName}
            onDelete={handleDeleteCondition}
            onCancel={handleCancelChangingCondition}
            serverError={props.errors[condition._id]}
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

Conditions.propTypes = {
  isHomebrew: PropTypes.bool
};

const mapStateToProps = state => {
  return {
    homebrewConditions: state.condition.homebrewConditions,
    sharedConditions: state.condition.sharedConditions,
    errors: state.condition.errors,
    fetchingSharedError: state.condition.errorShared,
    fetchingHomebrewError: state.condition.errorHomebrew,
    fetchingShared: state.condition.fetchingShared,
    fetchingHomebrew: state.condition.fetchingHomebrew,
    saveAllCallbacks: state.condition.saveAllCallbacks
  };
};

export default connect(mapStateToProps)(Conditions);
