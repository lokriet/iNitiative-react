import * as ActionTypes from '../actions/actionTypes';
const initialState = {
  errors: {}, // errors for individual damage types operations. property keys are ids, for new one - ADD
  errorShared: null, // error for collective damage types operations
  errorHomebrew: null, // error for collective damage types operations
  fetchingShared: false,
  fetchingHomebrew: false,
  sharedDamageTypes: [],
  homebrewDamageTypes: [],
  sharedDamageTypesInitialised: null,
  homebrewDamageTypesInitialised: null
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

    case ActionTypes.damageType.REMOVE_DAMAGE_TYPE_ERROR:
      return removeDamageTypeError(state, action);

    case ActionTypes.damageType.START_FETCHING_SHARED_DAMAGE_TYPES:
      return startFetchingSharedDamageTypes(state, action);

    case ActionTypes.damageType.START_FETCHING_HOMEBREW_DAMAGE_TYPES:
      return startFetchingHomebrewDamageTypes(state, action);

    case ActionTypes.damageType.SET_SHARED_DAMAGE_TYPES:
      return setSharedDamageTypes(state, action);

    case ActionTypes.damageType.SET_HOMEBREW_DAMAGE_TYPES:
      return setHomebrewDamageTypes(state, action);

    case ActionTypes.damageType.FETCH_SHARED_DAMAGE_TYPES_FAILED:
      return fetchSharedDamageTypesFailed(state, action);

    case ActionTypes.damageType.FETCH_HOMEBREW_DAMAGE_TYPES_FAILED:
      return fetchHomebrewDamageTypesFailed(state, action);
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

const removeDamageTypeError = (state, action) => {
  return {
    ...state,
    errors: removeErrorFromStateErrors(state.errors, action.damageTypeId)
  };
};

const startFetchingSharedDamageTypes = (state, action) => {
  return {
    ...state,
    fetchingShared: true
  };
};

const startFetchingHomebrewDamageTypes = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: true
  };
};

const setSharedDamageTypes = (state, action) => {
  return {
    ...state,
    sharedDamageTypes: action.damageTypes,
    sharedDamageTypesInitialised: new Date().getTime(),
    fetchingShared: false,
    errorShared: null
  };
};

const setHomebrewDamageTypes = (state, action) => {
  return {
    ...state,
    homebrewDamageTypes: action.damageTypes,
    homebrewDamageTypesInitialised: new Date().getTime(),
    fetchingHomebrew: false,
    errorHomebrew: null
  };
};

const fetchSharedDamageTypesFailed = (state, action) => {
  return {
    ...state,
    fetchingShared: false,
    errorShared: action.error
  };
};

const fetchHomebrewDamageTypesFailed = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: false,
    errorHomebrew: action.error
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
