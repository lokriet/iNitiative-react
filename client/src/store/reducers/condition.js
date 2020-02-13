import * as ActionTypes from '../actions/actionTypes';
const initialState = {
  errors: {}, // errors for individual condition operations. property keys are ids, for new one - ADD
  error: null, // error for collective conditions operations
  fetching: false,
  sharedConditions: [],
  homebrewConditions: [],
  saveAllCallbacks: []
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

    case ActionTypes.condition.START_FETCHING_CONDITIONS:
      return startFetchingConditions(state, action);

    case ActionTypes.condition.SET_SHARED_CONDITIONS:
      return setSharedConditions(state, action);

    case ActionTypes.condition.FETCH_CONDITIONS_FAILED:
      return fetchConditionsFailed(state, action);

    case ActionTypes.condition.REGISTER_SAVE_CONDITION_CALLBACK:
      return registerSaveConditionCallback(state, action);

    case ActionTypes.condition.UNREGISTER_SAVE_CONDITION_CALLBACK:
      return unregisterSaveConditionCallback(state, action);

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
    console.log('new conditions', newConditions);
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
    console.log('new conditions', newConditions, action.condition);
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

const startFetchingConditions = (state, action) => {
  return {
    ...state,
    fetching: true
  };
};

const setSharedConditions = (state, action) => {
  return {
    ...state,
    sharedConditions: action.conditions,
    fetching: false,
    error: null
  };
};

const fetchConditionsFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: action.error
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

const registerSaveConditionCallback = (state, action) => {
  return {
    ...state,
    saveAllCallbacks: state.saveAllCallbacks.concat({
      conditionId: action.conditionId,
      callback: action.callback
    })
  };
};

const unregisterSaveConditionCallback = (state, action) => {
  return  {
    ...state,
    saveAllCallbacks: state.saveAllCallbacks.filter(
      item => item.conditionId !== action.conditionId
    )
  };
};

export default conditionsReducer;
