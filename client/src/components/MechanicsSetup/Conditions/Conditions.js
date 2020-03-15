import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Prompt } from 'react-router';

import * as actions from '../../../store/actions/index';

import AddCondition from './AddCondition/AddCondition';
import Condition from './Condition/Condition';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';

import classes from './Conditions.module.css';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';

const Conditions = props => {
  const [saveCallbacks, setSaveCallbacks] = useState({});
  const [changedConditions, setChangedConditions] = useState(new Set());

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

  const handleUnsavedChangesStateChange = useCallback(
    (conditionId, hasUnsavedChanges) => {
      setChangedConditions(previousChangedConditions => {
        const newChangedConditions = new Set(previousChangedConditions);
        if (hasUnsavedChanges) {
          newChangedConditions.add(conditionId);
        } else {
          newChangedConditions.delete(conditionId);
        }
        
        console.log('new changes count', newChangedConditions.size);
        return newChangedConditions;
      });
    },
    []
  );

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
      dispatch(actions.addCondition(condition, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateCondition = useCallback(
    (condition, setSubmitted) => {
      dispatch(
        actions.updateCondition(condition, props.isHomebrew, setSubmitted)
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
    for (let conditionId in saveCallbacks) {
      saveCallbacks[conditionId]();
    }
  }, [saveCallbacks]);

  const handleItemsFiltered = useCallback(filteredItems => {
    setFilteredConditions(filteredItems);
  }, []);

  const fetchingError = props.isHomebrew
    ? props.fetchingHomebrewError
    : props.fetchingSharedError;
  const fetching = props.isHomebrew
    ? props.fetchingHomebrew
    : props.fetchingShared;
  let view;
  if (fetching) {
    view = <Spinner />;
  } else if (fetchingError) {
    view = <ServerError serverError={fetchingError} />;
  } else {
    view = (
      <>
        <Prompt
          when={changedConditions.size > 0}
          message="You have unsaved changes. Are you sure you want to leave?"
        />
        <AddCondition
          serverError={props.errors.ADD}
          onValidateName={validateName}
          onSave={handleAddCondition}
          onCancel={handleCancelChangingCondition}
        />

        <ItemsRow className={classes.SearchRow} centered alignCentered>
          <div>
            <FilterInput
              allItems={allConditions}
              onItemsFiltered={handleItemsFiltered}
            />
          </div>
          <IconButton icon={faCheck} onClick={handleSaveAll}>
            Save all changes
          </IconButton>
        </ItemsRow>

        {filteredConditions.map(condition => (
          <Condition
            key={condition._id}
            condition={condition}
            onSave={handleUpdateCondition}
            onValidateName={validateName}
            onDelete={handleDeleteCondition}
            onCancel={handleCancelChangingCondition}
            onRegisterSaveCallback={handleRegisterSaveCallback}
            onUnregisterSaveCallback={handleUnregisterSaveCallback}
            onHaveUnsavedChangesStateChange={hasUnsavedChanges =>
              handleUnsavedChangesStateChange(
                condition._id.toString(),
                hasUnsavedChanges
              )
            }
            serverError={props.errors[condition._id]}
          />
        ))}
      </>
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
    fetchingHomebrew: state.condition.fetchingHomebrew
  };
};

export default connect(mapStateToProps)(Conditions);
