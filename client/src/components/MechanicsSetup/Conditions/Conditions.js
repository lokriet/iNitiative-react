import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Prompt } from 'react-router';

import AddCondition from './AddCondition/AddCondition';
import Condition from './Condition/Condition';
import ServerError from '../../UI/Errors/ServerError/ServerError';
import Spinner from '../../UI/Spinner/Spinner';
import IconButton from '../../UI/Form/Button/IconButton/IconButton';
import FilterInput from '../../UI/FilterInput/FilterInput';
import ItemsRow from '../../UI/ItemsRow/ItemsRow';
import Popup from 'reactjs-popup';
import Button from '../../UI/Form/Button/Button';

import classes from './Conditions.module.css';
import {
  getHomebrewConditions,
  getSharedConditions,
  addCondition,
  updateCondition,
  removeConditionError,
  deleteCondition
} from './conditionSlice';

const Conditions = (props) => {
  const [saveCallbacks, setSaveCallbacks] = useState({});
  const [changedConditions, setChangedConditions] = useState(new Set());

  const [deleting, setDeleting] = useState(false);
  const [deletingCondition, setDeletingCondition] = useState(null);

  const dispatch = useDispatch();
  const allConditions = props.isHomebrew
    ? props.homebrewConditions
    : props.sharedConditions;

  const [filteredConditions, setFilteredConditions] = useState(allConditions);

  useEffect(() => {
    props.isHomebrew
      ? dispatch(getHomebrewConditions())
      : dispatch(getSharedConditions());
  }, [dispatch, props.isHomebrew]);

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

  const handleUnsavedChangesStateChange = useCallback(
    (conditionId, hasUnsavedChanges) => {
      setChangedConditions((previousChangedConditions) => {
        const newChangedConditions = new Set(previousChangedConditions);
        if (hasUnsavedChanges) {
          newChangedConditions.add(conditionId);
        } else {
          newChangedConditions.delete(conditionId);
        }

        return newChangedConditions;
      });
    },
    []
  );

  const validateName = useCallback(
    (_id, name) => {
      const result = !allConditions.some(
        (item) => (_id == null || item._id !== _id) && item.name === name
      );
      return result;
    },
    [allConditions]
  );

  const handleAddCondition = useCallback(
    (condition, setSubmitted) => {
      dispatch(addCondition(condition, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleUpdateCondition = useCallback(
    (condition, setSubmitted) => {
      dispatch(updateCondition(condition, props.isHomebrew, setSubmitted));
    },
    [dispatch, props.isHomebrew]
  );

  const handleDeleteConditionClicked = useCallback(
    (condition) => {
      dispatch(removeConditionError(condition._id));
      setDeletingCondition(condition);
      setDeleting(true);
    },
    [dispatch]
  );

  const handleDeleteConditionCancelled = useCallback(() => {
    setDeletingCondition(null);
    setDeleting(false);
  }, []);

  const handleDeleteConditionConfirmed = useCallback(() => {
    dispatch(deleteCondition(deletingCondition._id));
    setDeletingCondition(null);
    setDeleting(false);
  }, [dispatch, deletingCondition]);

  const handleCancelChangingCondition = useCallback(
    (conditionId) => {
      dispatch(removeConditionError(conditionId));
    },
    [dispatch]
  );

  const handleSaveAll = useCallback(() => {
    for (let conditionId in saveCallbacks) {
      saveCallbacks[conditionId]();
    }
  }, [saveCallbacks]);

  const handleItemsFiltered = useCallback((filteredItems) => {
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

        {filteredConditions.map((condition) => (
          <Condition
            key={condition._id}
            condition={condition}
            onSave={handleUpdateCondition}
            onValidateName={validateName}
            onDelete={handleDeleteConditionClicked}
            onCancel={handleCancelChangingCondition}
            onRegisterSaveCallback={handleRegisterSaveCallback}
            onUnregisterSaveCallback={handleUnregisterSaveCallback}
            onHaveUnsavedChangesStateChange={(hasUnsavedChanges) =>
              handleUnsavedChangesStateChange(
                condition._id.toString(),
                hasUnsavedChanges
              )
            }
            serverError={props.errors[condition._id]}
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
              Delete condition {deletingCondition ? deletingCondition.name : ''}
              ?
            </div>
            <br />
            <ItemsRow centered>
              <Button onClick={handleDeleteConditionConfirmed}>Yes</Button>
              <Button onClick={handleDeleteConditionCancelled}>No</Button>
            </ItemsRow>
          </div>
        </Popup>
      </>
    );
  }
  return view;
};

Conditions.propTypes = {
  isHomebrew: PropTypes.bool
};

const mapStateToProps = (state) => {
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
