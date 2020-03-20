import * as ActionTypes from '../actions/actionTypes';
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

const conditionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.condition.ADD_CONDITION_SUCCESS:
      return addConditionSuccess(state, action);

    case ActionTypes.condition.UPDATE_CONDITION_SUCCESS:
      return updateConditionSuccess(state, action);

    case ActionTypes.condition.DELETE_CONDITION_SUCCESS:
      return deleteConditionSuccess(state, action);

    case ActionTypes.condition.CONDITION_OPERATION_FAILED:
      return conditionOperationFailed(state, action);

    case ActionTypes.condition.REMOVE_CONDITION_ERROR:
      return removeConditionError(state, action);

    case ActionTypes.condition.START_FETCHING_SHARED_CONDITIONS:
      return startFetchingSharedConditions(state, action);

    case ActionTypes.condition.START_FETCHING_HOMEBREW_CONDITIONS:
      return startFetchingHomebrewConditions(state, action);

    case ActionTypes.condition.SET_SHARED_CONDITIONS:
      return setSharedConditions(state, action);

    case ActionTypes.condition.SET_HOMEBREW_CONDITIONS:
      return setHomebrewConditions(state, action);

    case ActionTypes.condition.FETCH_SHARED_CONDITIONS_FAILED:
      return fetchSharedConditionsFailed(state, action);

    case ActionTypes.condition.FETCH_HOMEBREW_CONDITIONS_FAILED:
      return fetchHomebrewConditionsFailed(state, action);

    case ActionTypes.condition.RESET_CONDITION_STORE:
      return resetConditionStore(state, action);

    default:
      return state;
  }
};

const addConditionSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(state.errors, null);

  if (action.condition.isHomebrew) {
    return {
      ...state,
      homebrewConditions: state.homebrewConditions
        .concat(action.condition)
        .sort((a, b) => a.name.localeCompare(b.name)),
      errors: newErrors
    };
  } else {
    return {
      ...state,
      sharedConditions: state.sharedConditions
        .concat(action.condition)
        .sort((a, b) => a.name.localeCompare(b.name)),
      errors: newErrors
    };
  }
};

const updateConditionSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(
    state.errors,
    action.condition._id
  );

  if (action.condition.isHomebrew) {
    const newConditions = state.homebrewConditions
      .map(item =>
        item._id === action.condition._id ? action.condition : item
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      ...state,
      homebrewConditions: newConditions,
      errors: newErrors
    };
  } else {
    const newConditions = state.sharedConditions
      .map(item =>
        item._id === action.condition._id ? action.condition : item
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    return {
      ...state,
      sharedConditions: newConditions,
      errors: newErrors
    };
  }
};

const deleteConditionSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(
    state.errors,
    action.conditionId
  );

  return {
    ...state,
    errors: newErrors,
    sharedConditions: state.sharedConditions.filter(
      item => item._id !== action.conditionId
    ),
    homebrewConditions: state.homebrewConditions.filter(
      item => item._id !== action.conditionId
    )
  };
};

const conditionOperationFailed = (state, action) => {
  const conditionId = action.conditionId || 'ADD';
  return {
    ...state,
    errors: { ...state.errors, [conditionId]: action.error }
  };
};

const removeConditionError = (state, action) => {
  return {
    ...state,
    errors: removeErrorFromStateErrors(state.errors, action.conditionId)
  };
};

const startFetchingSharedConditions = (state, action) => {
  return {
    ...state,
    fetchingShared: true
  };
};

const startFetchingHomebrewConditions = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: true
  };
};

const setSharedConditions = (state, action) => {
  return {
    ...state,
    sharedConditions: action.conditions,
    sharedConditionsInitialised: new Date().getTime(),
    fetchingShared: false,
    errorShared: null
  };
};

const setHomebrewConditions = (state, action) => {
  return {
    ...state,
    homebrewConditions: action.conditions,
    homebrewConditionsInitialised: new Date().getTime(),
    fetchingHomebrew: false,
    errorHomebrew: null
  };
};

const fetchSharedConditionsFailed = (state, action) => {
  return {
    ...state,
    fetchingShared: false,
    errorShared: action.error
  };
};

const fetchHomebrewConditionsFailed = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: false,
    errorHomebrew: action.error
  };
};

const removeErrorFromStateErrors = (errors, conditionId) => {
  let newErrors;
  const errorId = conditionId || 'ADD';
  if (errors[errorId] != null) {
    newErrors = { ...errors };
    delete newErrors[errorId];
    if (newErrors == null) {
      newErrors = {};
    }
  } else {
    newErrors = errors;
  }
  return newErrors;
};

const resetConditionStore = (state, action) => {
  return initialState;
};

export default conditionsReducer;
