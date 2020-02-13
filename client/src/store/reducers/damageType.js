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

    case ActionTypes.damageType.DELETE_DAMAGE_TYPE_SUCCESS:
      return deleteDamageTypeSuccess(state, action);

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
  const newErrors = removeErrorFromStateErrors(state.errors, null)

  if (action.damageType.isHomebrew) {
    return {
      ...state,
      homebrewDamageTypes: state.homebrewDamageTypes.concat(action.damageType).sort((a, b) => a.name.localeCompare(b.name)),
      errors: newErrors
    };
  } else {
    return {
      ...state,
      sharedDamageTypes: state.sharedDamageTypes.concat(action.damageType).sort((a, b) => a.name.localeCompare(b.name)),
      errors: newErrors
    };
  }
};

const updateDamageTypeSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(state.errors, action.damageType._id)

  if (action.damageType.isHomebrew) {
    const newDamageTypes = state.homebrewDamageTypes.map(item =>
      item._id === action.damageType._id ? action.damageType : item
    ).sort((a, b) => a.name.localeCompare(b.name));
    console.log('new damage types', newDamageTypes);
    return {
      ...state,
      homebrewDamageTypes: newDamageTypes,
      errors: newErrors
    };
  } else {
    const newDamageTypes = state.sharedDamageTypes.map(item =>
      item._id === action.damageType._id ? action.damageType : item
    ).sort((a, b) => a.name.localeCompare(b.name));
    console.log('new damage types', newDamageTypes, action.damageType);
    return {
      ...state,
      sharedDamageTypes: newDamageTypes,
      errors: newErrors
    };
  }
};

const deleteDamageTypeSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(state.errors, action.damageTypeId);

  return {
    ...state,
    errors: newErrors,
    sharedDamageTypes: state.sharedDamageTypes.filter(item => item._id !== action.damageTypeId),
    homebrewDamageTypes: state.homebrewDamageTypes.filter(item => item._id !== action.damageTypeId)
  }
}

const damageTypeOperationFailed = (state, action) => {
  const damageTypeId = action.damageTypeId || 'ADD';
  return {
    ...state,
    errors: { ...state.errors, [damageTypeId]: action.error }
  };
};

const removeError = (state, action) => {
  return {
    ...state,
    errors: removeErrorFromStateErrors(state.errors, action.damageTypeId)
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


const removeErrorFromStateErrors = (errors, damageTypeId) => {
  let newErrors;
  const errorId = damageTypeId || 'ADD';
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
}

export default damageTypesReducer;
