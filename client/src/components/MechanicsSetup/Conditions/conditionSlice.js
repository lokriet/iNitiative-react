import ErrorType from '../../../util/error';
import constants from '../../../util/constants';
import { firebaseObtainIdToken } from '../../Firebase/firebaseMiddleware';
import * as actions from '../../../store/actions';

const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  errors: {}, // errors for individual condition operations. property keys are ids, for new one - ADD
  errorShared: null, // error for collective conditions operations
  errorHomebrew: null, // error for collective conditions operations
  fetchingShared: false,
  fetchingHomebrew: false,
  sharedConditions: [],
  homebrewConditions: [],
  sharedConditionsInitialised: null,
  homebrewConditionsInitialised: null
};

const conditionsComparator = (a, b) => a.name.localeCompare(b.name);

const addConditionSuccess = (state, action) => {
  const addedCondition = action.payload;
  state.errors = removeErrorFromStateErrors(state.errors, null);

  if (addedCondition.isHomebrew) {
    state.homebrewConditions.push(addedCondition);
    state.homebrewConditions.sort(conditionsComparator);
  } else {
    state.sharedConditions.push(addedCondition);
    state.sharedConditions.sort(conditionsComparator);
  }
};

const updateConditionSuccess = (state, action) => {
  const updatedCondition = action.payload;
  state.errors = removeErrorFromStateErrors(state.errors, updatedCondition._id);

  if (updatedCondition.isHomebrew) {
    state.homebrewConditions = state.homebrewConditions
      .map((item) =>
        item._id === updatedCondition._id ? updatedCondition : item
      )
      .sort(conditionsComparator);
  } else {
    state.sharedConditions = state.sharedConditions
      .map((item) =>
        item._id === updatedCondition._id ? updatedCondition : item
      )
      .sort(conditionsComparator);
  }
};

const deleteConditionSuccess = (state, action) => {
  const deletedConditionId = action.payload;
  state.errors = removeErrorFromStateErrors(state.errors, deletedConditionId);

  state.sharedConditions = state.sharedConditions.filter(
    (item) => item._id !== deletedConditionId
  );
  state.homebrewConditions = state.homebrewConditions.filter(
    (item) => item._id !== deletedConditionId
  );
};

const conditionOperationFailed = (state, action) => {
  const conditionId = action.payload.conditionId || 'ADD';
  state.errors[conditionId] = action.payload.error;
};

const removeConditionErrorAction = (state, action) => {
  state.errors = removeErrorFromStateErrors(state.errors, action.payload);
};

const startFetchingSharedConditions = (state, action) => {
  state.fetchingShared = true;
};

const startFetchingHomebrewConditions = (state, action) => {
  state.fetchingHomebrew = true;
};

const setSharedConditions = (state, action) => {
  state.sharedConditions = action.payload;
  state.sharedConditionsInitialised = new Date().getTime();
  state.fetchingShared = false;
  state.errorShared = null;
};

const setHomebrewConditions = (state, action) => {
  state.homebrewConditions = action.payload;
  state.homebrewConditionsInitialised = new Date().getTime();
  state.fetchingHomebrew = false;
  state.errorHomebrew = null;
};

const fetchSharedConditionsFailed = (state, action) => {
  state.fetchingShared = false;
  state.errorShared = action.payload;
};

const fetchHomebrewConditionsFailed = (state, action) => {
  state.fetchingHomebrew = false;
  state.errorHomebrew = action.payload;
};

const removeErrorFromStateErrors = (errors, conditionId) => {
  let newErrors = errors;
  const errorId = conditionId || 'ADD';

  if (errors[errorId] != null) {
    delete newErrors[errorId];
    if (newErrors == null) {
      newErrors = {};
    }
  }

  return newErrors;
};

const conditionSlice = createSlice({
  name: 'condition',
  initialState,
  reducers: {
    addConditionSuccess,
    updateConditionSuccess,
    deleteConditionSuccess,
    conditionOperationFailed,
    removeConditionError: removeConditionErrorAction,
    startFetchingSharedConditions,
    startFetchingHomebrewConditions,
    setSharedConditions,
    setHomebrewConditions,
    fetchSharedConditionsFailed,
    fetchHomebrewConditionsFailed,

    resetConditionStore: (state, action) => initialState
  }
});

export default conditionSlice.reducer;

export const {
  removeConditionError,
  resetConditionStore
} = conditionSlice.actions;

export const addCondition = (condition, isHomebrew, setSubmitted) => async (
  dispatch,
  getState
) => {
  try {
    await dispatch(firebaseObtainIdToken());
    const idToken = getState().firebase.idToken;
    const response = await fetch(
      `${constants.serverUrl}/conditions/condition`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
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
        conditionSlice.actions.conditionOperationFailed({
          conditionId: null,
          error: {
            type: ErrorType[response.status],
            message: responseData.message
          }
        })
      );
      setSubmitted(false);
    } else if (response.status === 422) {
      dispatch(
        conditionSlice.actions.conditionOperationFailed({
          conditionId: null,
          error: {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          }
        })
      );
      setSubmitted(false);
    } else if (response.status === 201) {
      dispatch(conditionSlice.actions.addConditionSuccess(responseData.data));
      setSubmitted(true);
    } else {
      dispatch(
        conditionSlice.actions.conditionOperationFailed({
          conditionId: null,
          error: {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          }
        })
      );
      setSubmitted(false);
    }
  } catch (error) {
    console.log(error);
    dispatch(
      conditionSlice.actions.conditionOperationFailed({
        conditionId: null,
        error: {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        }
      })
    );
    setSubmitted(false);
  }
};

export const updateCondition = (condition, isHomebrew, setSubmitted) => async (
  dispatch,
  getState
) => {
  try {
    await dispatch(firebaseObtainIdToken());
    const idToken = getState().firebase.idToken;
    const response = await fetch(
      `${constants.serverUrl}/conditions/condition/${condition._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
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
        conditionSlice.actions.conditionOperationFailed({
          conditionId: condition._id,
          error: {
            type: ErrorType[response.status],
            message: responseData.message
          }
        })
      );
      setSubmitted(false);
    } else if (response.status === 422) {
      dispatch(
        conditionSlice.actions.conditionOperationFailed({
          conditionId: condition._id,
          error: {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          }
        })
      );
      setSubmitted(false);
    } else if (response.ok) {
      dispatch(
        conditionSlice.actions.updateConditionSuccess(responseData.data)
      );
      dispatch(actions.resetParticipantTemplateStore());
      setSubmitted(true);
    } else {
      dispatch(
        conditionSlice.actions.conditionOperationFailed({
          conditionId: condition._id,
          error: {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          }
        })
      );
      setSubmitted(false);
    }
  } catch (error) {
    console.log(error);
    dispatch(
      conditionSlice.actions.conditionOperationFailed({
        conditionId: condition._id,
        error: {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        }
      })
    );
    setSubmitted(false);
  }
};

export const deleteCondition = (conditionId) => async (dispatch, getState) => {
  try {
    await dispatch(firebaseObtainIdToken());
    const idToken = getState().firebase.idToken;
    const response = await fetch(
      `${constants.serverUrl}/conditions/condition/${conditionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${idToken}`
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
        conditionSlice.actions.conditionOperationFailed({
          conditionId,
          error: {
            type: ErrorType[response.status],
            message: responseData.message
          }
        })
      );
    } else if (response.status === 200) {
      dispatch(conditionSlice.actions.deleteConditionSuccess(conditionId));
      dispatch(actions.resetParticipantTemplateStore());
    } else {
      dispatch(
        conditionSlice.actions.conditionOperationFailed({
          conditionId,
          error: {
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: 'Internal error occured. Please try again.'
          }
        })
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(
      conditionSlice.actions.conditionOperationFailed({
        conditionId,
        error: {
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Internal error occured. Please try again.'
        }
      })
    );
  }
};

export const getSharedConditions = () => async (dispatch, getState) => {
  if (
    getState().condition.sharedConditionsInitialised &&
    new Date().getTime() - getState().condition.sharedConditionsInitialised <
      constants.refreshDataTimeout
  ) {
    return;
  }

  try {
    dispatch(conditionSlice.actions.startFetchingSharedConditions());
    const response = await fetch(`${constants.serverUrl}/conditions/shared`);
    if (response.status === 200) {
      const conditions = await response.json();
      dispatch(conditionSlice.actions.setSharedConditions(conditions));
    } else {
      dispatch(
        conditionSlice.actions.fetchSharedConditionsFailed({
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Fetching shared conditions failed'
        })
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(
      conditionSlice.actions.fetchSharedConditionsFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: 'Fetching shared conditions failed'
      })
    );
  }
};

export const getHomebrewConditions = () => {
  return async (dispatch, getState) => {
    if (
      getState().condition.homebrewConditionsInitialised &&
      new Date().getTime() -
        getState().condition.homebrewConditionsInitialised <
        constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(conditionSlice.actions.startFetchingHomebrewConditions());
      await dispatch(firebaseObtainIdToken());
      const idToken = getState().firebase.idToken;
      const response = await fetch(
        `${constants.serverUrl}/conditions/homebrew`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      if (response.status === 500 || response.status === 401) {
        const responseData = await response.json();
        dispatch(
          conditionSlice.actions.fetchHomebrewConditionsFailed({
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        const conditions = await response.json();
        dispatch(conditionSlice.actions.setHomebrewConditions(conditions));
      } else {
        dispatch(
          conditionSlice.actions.fetchHomebrewConditionsFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching homebrew conditions failed'
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        conditionSlice.actions.fetchHomebrewConditionsFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching homebrew conditions failed'
        })
      );
    }
  };
};
