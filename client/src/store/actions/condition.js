import ErrorType from '../../util/error';
import * as constants from '../../util/constants';

export const ConditionActionTypes = {
  ADD_CONDITION_SUCCESS: 'ADD_CONDITION_SUCCESS',
  UPDATE_CONDITION_SUCCESS: 'UPDATE_CONDITION_SUCCESS',
  DELETE_CONDITION_SUCCESS: 'DELETE_CONDITION_SUCCESS',
  CONDITION_OPERATION_FAILED: 'ADD_CONDITION_FAILED',
  REMOVE_CONDITION_ERROR: 'REMOVE_CONDITION_ERROR',

  START_FETCHING_SHARED_CONDITIONS: 'START_FETCHING_SHARED_CONDITIONS',
  START_FETCHING_HOMEBREW_CONDITIONS: 'START_FETCHING_HOMEBREW_CONDITIONS',
  SET_SHARED_CONDITIONS: 'SET_SHARED_CONDITIONS',
  SET_HOMEBREW_CONDITIONS: 'SET_HOMEBREW_CONDITIONS',
  FETCH_SHARED_CONDITIONS_FAILED: 'FETCH_SHARED_CONDITIONS_FAILED',
  FETCH_HOMEBREW_CONDITIONS_FAILED: 'FETCH_HOMEBREW_CONDITIONS_FAILED',

  REGISTER_SAVE_CONDITION_CALLBACK: 'REGISTER_SAVE_CONDITION_CALLBACK',
  UNREGISTER_SAVE_CONDITION_CALLBACK: 'UNREGISTER_SAVE_CONDITION_CALLBACK'
};

export const addCondition = (condition, isHomebrew, token, setSubmitted) => {
  return async dispatch => {
    try {
      const response = await fetch(
        'http://localhost:3001/conditions/condition',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ condition, isHomebrew })
        }
      );

      const responseData = await response.json();
      console.log('got response for condition creation', responseData);

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          conditionOperationFailed(null, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
        setSubmitted(false);
      } else if (response.status === 422) {
        dispatch(
          conditionOperationFailed(null, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
        setSubmitted(false);
      } else if (response.status === 201) {
        console.log(responseData.data);
        dispatch(addConditionSuccess(responseData.data));
        setSubmitted(true);
      } else {
        console.log('Unexpected response status');
        dispatch(
          conditionOperationFailed(null, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
        setSubmitted(false);
      }
    } catch (error) {
      dispatch(
        conditionOperationFailed(null, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
      setSubmitted(false);
    }
  };
};

export const updateCondition = (condition, isHomebrew, token, setSubmitted) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/conditions/condition/${condition._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ condition, isHomebrew })
        }
      );

      const responseData = await response.json();
      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          conditionOperationFailed(condition._id, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
        setSubmitted(false);
      } else if (response.status === 422) {
        dispatch(
          conditionOperationFailed(condition._id, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
        setSubmitted(false);
      } else if (response.status === 200) {
        console.log(responseData);
        dispatch(updateConditionSuccess(responseData.data));
        setSubmitted(true);
      } else {
        console.log('Unexpected response status');
        dispatch(
          conditionOperationFailed(condition._id, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
        setSubmitted(false);
      }
    } catch (error) {
      dispatch(
        conditionOperationFailed(condition._id, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
      setSubmitted(false);
    }
  };
};

export const deleteCondition = (conditionId, token) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/conditions/condition/${conditionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const responseData = await response.json();

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          conditionOperationFailed(conditionId, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteConditionSuccess(conditionId));
      } else {
        console.log('Unexpected response status');
        dispatch(
          conditionOperationFailed(conditionId, {
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
      }
    } catch (error) {
      dispatch(
        conditionOperationFailed(conditionId, {
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
    }
  };
};

export const getSharedConditions = () => {
  return async (dispatch, getState) => {
    if (
      getState().condition.sharedConditionsInitialised &&
      new Date().getTime() - getState().condition.sharedConditionsInitialised <
        constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(startFetchingSharedConditions());
      const response = await fetch('http://localhost:3001/conditions/shared');
      if (response.status === 200) {
        const conditions = await response.json();
        dispatch(setSharedConditions(conditions));
      } else {
        dispatch(
          fetchSharedConditionsFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching shared conditions failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchSharedConditionsFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching shared conditions failed'
        })
      );
    }
  };
};

export const getHomebrewConditions = token => {
  return async (dispatch, getState) => {
    if (
      getState().condition.homebrewConditionsInitialised &&
      new Date().getTime() - getState().condition.homebrewConditionsInitialised <
      constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(startFetchingHomebrewConditions());
      const response = await fetch(
        'http://localhost:3001/conditions/homebrew',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 500 || response.status === 401) {
        const responseData = await response.json();
        dispatch(
          fetchHomebrewConditionsFailed({
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        const conditions = await response.json();
        dispatch(setHomebrewConditions(conditions));
      } else {
        dispatch(
          fetchHomebrewConditionsFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching homebrew conditions failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchHomebrewConditionsFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching homebrew conditions failed'
        })
      );
    }
  };
};

export const addConditionSuccess = condition => {
  return {
    type: ConditionActionTypes.ADD_CONDITION_SUCCESS,
    condition
  };
};

export const updateConditionSuccess = condition => {
  return {
    type: ConditionActionTypes.UPDATE_CONDITION_SUCCESS,
    condition
  };
};

export const deleteConditionSuccess = conditionId => {
  return {
    type: ConditionActionTypes.DELETE_CONDITION_SUCCESS,
    conditionId
  };
};

export const conditionOperationFailed = (conditionId, error) => {
  return {
    type: ConditionActionTypes.CONDITION_OPERATION_FAILED,
    conditionId,
    error
  };
};

export const removeConditionError = conditionId => {
  return {
    type: ConditionActionTypes.REMOVE_CONDITION_ERROR,
    conditionId
  };
};

export const startFetchingSharedConditions = () => {
  return {
    type: ConditionActionTypes.START_FETCHING_SHARED_CONDITIONS
  };
};

export const startFetchingHomebrewConditions = () => {
  return {
    type: ConditionActionTypes.START_FETCHING_HOMEBREW_CONDITIONS
  };
};

export const setSharedConditions = conditions => {
  return {
    type: ConditionActionTypes.SET_SHARED_CONDITIONS,
    conditions
  };
};

export const setHomebrewConditions = conditions => {
  return {
    type: ConditionActionTypes.SET_HOMEBREW_CONDITIONS,
    conditions
  };
};

export const fetchSharedConditionsFailed = error => {
  return {
    type: ConditionActionTypes.FETCH_SHARED_CONDITIONS_FAILED,
    error
  };
};

export const fetchHomebrewConditionsFailed = error => {
  return {
    type: ConditionActionTypes.FETCH_HOMEBREW_CONDITIONS_FAILED,
    error
  };
};

export const registerSaveConditionCallback = (conditionId, callback) => {
  return {
    type: ConditionActionTypes.REGISTER_SAVE_CONDITION_CALLBACK,
    conditionId,
    callback
  };
};

export const unregisterSaveConditionCallback = conditionId => {
  return {
    type: ConditionActionTypes.UNREGISTER_SAVE_CONDITION_CALLBACK,
    conditionId
  };
};
