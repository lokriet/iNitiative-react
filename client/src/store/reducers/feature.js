import * as ActionTypes from '../actions/actionTypes';
const initialState = {
  errors: {}, // errors for individual feature operations. property keys are ids, for new one - ADD
  errorShared: null, // error for collective features operations
  errorHomebrew: null, // error for collective features operations
  fetchingShared: false,
  fetchingHomebrew: false,
  sharedFeatures: [],
  homebrewFeatures: [],
  sharedFeaturesInitialised: null,
  homebrewFeaturesInitialised: null,
  featureTypes: []
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

    case ActionTypes.feature.START_FETCHING_SHARED_FEATURES:
      return startFetchingSharedFeatures(state, action);

    case ActionTypes.feature.START_FETCHING_HOMEBREW_FEATURES:
      return startFetchingHomebrewFeatures(state, action);

    case ActionTypes.feature.SET_SHARED_FEATURES:
      return setSharedFeatures(state, action);

    case ActionTypes.feature.SET_HOMEBREW_FEATURES:
      return setHomebrewFeatures(state, action);

    case ActionTypes.feature.FETCH_SHARED_FEATURES_FAILED:
      return fetchSharedFeaturesFailed(state, action);

    case ActionTypes.feature.FETCH_HOMEBREW_FEATURES_FAILED:
      return fetchHomebrewFeaturesFailed(state, action);

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

const startFetchingSharedFeatures = (state, action) => {
  return {
    ...state,
    fetchingShared: true
  };
};

const startFetchingHomebrewFeatures = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: true
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
    fetchingShared: false,
    errorShared: null
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
    fetchingHomebrew: false,
    errorHomebrew: null
  };
};

const fetchSharedFeaturesFailed = (state, action) => {
  return {
    ...state,
    fetchingShared: false,
    errorShared: action.error
  };
};

const fetchHomebrewFeaturesFailed = (state, action) => {
  return {
    ...state,
    fetchingHomebrew: false,
    errorHomebrew: action.error
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

export default featuresReducer;
