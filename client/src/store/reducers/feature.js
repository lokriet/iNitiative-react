import * as ActionTypes from '../actions/actionTypes';
const initialState = {
  errors: {}, // errors for individual feature operations. property keys are ids, for new one - ADD
  error: null, // error for collective features operations
  fetching: false,
  sharedFeatures: [],
  homebrewFeatures: [],
  sharedFeaturesInitialised: null,
  homebrewFeaturesInitialised: null,
  featureTypes: [],
  saveAllCallbacks: []
};

const featuresReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.feature.ADD_FEATURE_SUCCESS:
      return addFeatureSuccess(state, action);

    case ActionTypes.feature.UPDATE_FEATURE_SUCCESS:
      return updateFeatureSuccess(state, action);

    case ActionTypes.feature.DELETE_FEATURE_SUCCESS:
      return deleteFeatureSuccess(state, action);

    case ActionTypes.feature.FEATURE_OPERATION_FAILED:
      return featureOperationFailed(state, action);

    case ActionTypes.feature.REMOVE_FEATURE_ERROR:
      return removeFeatureError(state, action);

    case ActionTypes.feature.START_FETCHING_FEATURES:
      return startFetchingFeatures(state, action);

    case ActionTypes.feature.SET_SHARED_FEATURES:
      return setSharedFeatures(state, action);

    case ActionTypes.feature.SET_HOMEBREW_FEATURES:
      return setHomebrewFeatures(state, action);

    case ActionTypes.feature.FETCH_FEATURES_FAILED:
      return fetchFeaturesFailed(state, action);

    case ActionTypes.feature.REGISTER_SAVE_FEATURE_CALLBACK:
      return registerSaveFeatureCallback(state, action);

    case ActionTypes.feature.UNREGISTER_SAVE_FEATURE_CALLBACK:
      return unregisterSaveFeatureCallback(state, action);

    default:
      return state;
  }
};

const addFeatureSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(state.errors, null);

  let newFeatureTypes = state.featureTypes;
  if (
    action.feature.type != null &&
    action.feature.type.length !== 0 &&
    !state.featureTypes.includes(action.feature.type)
  ) {
    newFeatureTypes = state.featureTypes.concat(action.feature.type);
  }

  if (action.feature.isHomebrew) {
    return {
      ...state,
      homebrewFeatures: state.homebrewFeatures
        .concat(action.feature)
        .sort((a, b) => a.name.localeCompare(b.name)),
      featureTypes: newFeatureTypes,
      errors: newErrors
    };
  } else {
    return {
      ...state,
      sharedFeatures: state.sharedFeatures
        .concat(action.feature)
        .sort((a, b) => a.name.localeCompare(b.name)),
      featureTypes: newFeatureTypes,
      errors: newErrors
    };
  }
};

const updateFeatureSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(
    state.errors,
    action.feature._id
  );

  let newFeatureTypes = state.featureTypes;
  if (
    action.feature.type != null &&
    action.feature.type.length !== 0 &&
    !state.featureTypes.includes(action.feature.type)
  ) {
    newFeatureTypes = state.featureTypes.concat(action.feature.type);
  }

  if (action.feature.isHomebrew) {
    const newFeatures = state.homebrewFeatures
      .map(item => (item._id === action.feature._id ? action.feature : item))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log('new features', newFeatures);
    return {
      ...state,
      homebrewFeatures: newFeatures,
      featureTypes: newFeatureTypes,
      errors: newErrors
    };
  } else {
    const newFeatures = state.sharedFeatures
      .map(item => (item._id === action.feature._id ? action.feature : item))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log('new features', newFeatures, action.feature);
    return {
      ...state,
      sharedFeatures: newFeatures,
      featureTypes: newFeatureTypes,
      errors: newErrors
    };
  }
};

const deleteFeatureSuccess = (state, action) => {
  const newErrors = removeErrorFromStateErrors(state.errors, action.featureId);

  const newSharedFeatures = state.sharedFeatures.filter(
    item => item._id !== action.featureId
  );

  const newHomebrewFeatures = state.homebrewFeatures.filter(
    item => item._id !== action.featureId
  );

  const newFeatureTypes = getDistinctFeatureTypes(
    newSharedFeatures,
    newHomebrewFeatures
  );

  return {
    ...state,
    errors: newErrors,
    sharedFeatures: newSharedFeatures,
    homebrewFeatures: newHomebrewFeatures,
    featureTypes: newFeatureTypes
  };
};

const featureOperationFailed = (state, action) => {
  const featureId = action.featureId || 'ADD';
  return {
    ...state,
    errors: { ...state.errors, [featureId]: action.error }
  };
};

const removeFeatureError = (state, action) => {
  return {
    ...state,
    errors: removeErrorFromStateErrors(state.errors, action.featureId)
  };
};

const startFetchingFeatures = (state, action) => {
  return {
    ...state,
    fetching: true
  };
};

const setSharedFeatures = (state, action) => {
  return {
    ...state,
    sharedFeatures: action.features,
    sharedFeaturesInitialised: new Date().getTime(),
    featureTypes: getDistinctFeatureTypes(
      action.features,
      state.homebrewFeatures
    ),
    fetching: false,
    error: null
  };
};

const setHomebrewFeatures = (state, action) => {
  return {
    ...state,
    homebrewFeatures: action.features,
    homebrewFeaturesInitialised: new Date().getTime(),
    // featureTypes: getDistinctFeatureTypes(
    //   state.sharedFeatures,
    //   action.features
    // ),
    featureTypes: action.featureTypes,
    fetching: false,
    error: null
  };
};


const fetchFeaturesFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: action.error
  };
};

const removeErrorFromStateErrors = (errors, featureId) => {
  let newErrors;
  const errorId = featureId || 'ADD';
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

const getDistinctFeatureTypes = (sharedFeatures, homebrewFeatures) => {
  const featureTypesSet = new Set();
  sharedFeatures.forEach(feature => {
    if (feature.type != null && feature.type.length > 0)
      featureTypesSet.add(feature.type);
  });
  homebrewFeatures.forEach(feature => {
    if (feature.type != null && feature.type.length > 0)
      featureTypesSet.add(feature.type);
  });
  return [...featureTypesSet];
};

const registerSaveFeatureCallback = (state, action) => {
  return {
    ...state,
    saveAllCallbacks: state.saveAllCallbacks.concat({
      featureId: action.featureId,
      callback: action.callback
    })
  };
};

const unregisterSaveFeatureCallback = (state, action) => {
  return {
    ...state,
    saveAllCallbacks: state.saveAllCallbacks.filter(
      item => item.featureId !== action.featureId
    )
  };
};

export default featuresReducer;
