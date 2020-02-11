import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  errors: {}, // errors for individual damage types operations. property keys are ids, for new one - ADD
  error: null, // error for collective damage types operations
  fetching: false,
  sharedDamageTypes: [],
  homebrewDamageTypes: []
};

const damageTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.damageType.ADD_DAMAGE_TYPE_SUCCESS:
      return addDamageTypeSuccess(state, action);

    case ActionTypes.damageType.UPDATE_DAMAGE_TYPE_SUCCESS:
      return updateDamageTypeSuccess(state, action);

    case ActionTypes.damageType.DAMAGE_TYPE_OPERATION_FAILED:
      return damageTypeOperationFailed(state, action);

    case ActionTypes.damageType.REMOVE_ERROR:
      return removeError(state, action);

    case ActionTypes.damageType.START_FETCHING_DAMAGE_TYPES:
      return startFetchingDamageTypes(state, action);

    case ActionTypes.damageType.SET_SHARED_DAMAGE_TYPES:
      return setSharedDamageTypes(state, action);

    case ActionTypes.damageType.FETCH_DAMAGE_TYPES_FAILED:
      return fetchDamageTypesFailed(state, action);
    default:
      return state;
  }
};

const addDamageTypeSuccess = (state, action) => {
  let newErrors;
  if (state.errors.ADD != null) {
    newErrors = { ...state.errors };
    delete newErrors.ADD;
    if (newErrors == null) {
      newErrors = {};
    }
  } else {
    newErrors = state.errors;
  }

  if (action.damageType.isHomebrew) {
    return {
      ...state,
      homebrewDamageTypes: state.homebrewDamageTypes.concat(action.damageType),
      errors: newErrors
    };
  } else {
    return {
      ...state,
      sharedDamageTypes: state.sharedDamageTypes.concat(action.damageType),
      errors: newErrors
    };
  }
};

const updateDamageTypeSuccess = (state, action) => {
  let newErrors;
  if (state.errors[action.damageType._id] != null) {
    newErrors = { ...state.errors };
    delete newErrors[action.damageType._id];
    if (newErrors == null) {
      newErrors = {};
    }
  } else {
    newErrors = state.errors;
  }

  if (action.damageType.isHomebrew) {
    const newDamageTypes = state.homebrewDamageTypes.map(item =>
      item._id === action.damageType._id ? action.damageType : item
    );
    console.log('new damage types', newDamageTypes);
    return {
      ...state,
      homebrewDamageTypes: newDamageTypes,
      errors: newErrors
    };
  } else {
    const newDamageTypes = state.sharedDamageTypes.map(item =>
      item._id === action.damageType._id ? action.damageType : item
    );
    console.log('new damage types', newDamageTypes, action.damageType);
    return {
      ...state,
      sharedDamageTypes: newDamageTypes,
      errors: newErrors
    };
  }
};

const damageTypeOperationFailed = (state, action) => {
  const damageTypeId = action.damageTypeId || 'ADD';
  return {
    ...state,
    errors: { ...state.errors, [damageTypeId]: action.error }
  };
};

const removeError = (state, action) => {
  let newErrors;
  const errorId = action.damageTypeId || 'ADD';
  if (state.errors[errorId] != null) {
    console.log('gonna remove error', state.errors[errorId], errorId);
    newErrors = { ...state.errors };
    delete newErrors[errorId];
    if (newErrors == null) {
      newErrors = {};
    }
  } else {
    newErrors = state.errors;
  }

  return {
    ...state,
    errors: newErrors
  };
};

const startFetchingDamageTypes = (state, action) => {
  return {
    ...state,
    fetching: true
  };
};

const setSharedDamageTypes = (state, action) => {
  return {
    ...state,
    sharedDamageTypes: action.damageTypes,
    fetching: false,
    error: null
  };
};

const fetchDamageTypesFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: action.error
  };
};

export default damageTypesReducer;
