import ErrorType from '../../util/error';

export const FeatureActionTypes = {
  ADD_FEATURE_SUCCESS: 'ADD_FEATURE_SUCCESS',
  UPDATE_FEATURE_SUCCESS: 'UPDATE_FEATURE_SUCCESS',
  DELETE_FEATURE_SUCCESS: 'DELETE_FEATURE_SUCCESS',
  FEATURE_OPERATION_FAILED: 'ADD_FEATURE_FAILED',
  REMOVE_FEATURE_ERROR: 'REMOVE_FEATURE_ERROR',

  START_FETCHING_FEATURES: 'START_FETCHING_FEATURES',
  SET_SHARED_FEATURES: 'SET_SHARED_FEATURES',
  SET_HOMEBREW_FEATURES: 'SET_HOMEBREW_FEATURES',
  FETCH_FEATURES_FAILED: 'FETCH_FEATURES_FAILED',

  REGISTER_SAVE_FEATURE_CALLBACK: 'REGISTER_SAVE_FEATURE_CALLBACK',
  UNREGISTER_SAVE_FEATURE_CALLBACK: 'UNREGISTER_SAVE_FEATURE_CALLBACK'
};

export const addFeature = (feature, isHomebrew, token, setSubmitted) => {
  return async dispatch => {
    try {
      const response = await fetch(
        'http://localhost:3001/features/feature',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ feature, isHomebrew })
        }
      );

      const responseData = await response.json();
      console.log('got response for feature creation', responseData);

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          featureOperationFailed(null, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
        setSubmitted(false);
      } else if (response.status === 422) {
        dispatch(
          featureOperationFailed(null, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
        setSubmitted(false);
      } else if (response.status === 201) {
        console.log(responseData.data);
        dispatch(addFeatureSuccess(responseData.data));
        setSubmitted(true);
      } else {
        console.log('Unexpected response status');
        dispatch(
          featureOperationFailed(null, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
        setSubmitted(false);
      }
    } catch (error) {
      dispatch(
        featureOperationFailed(null, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
      setSubmitted(false);
    }
  };
};

export const updateFeature = (
  feature,
  isHomebrew,
  token,
  setSubmitted
) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/features/feature/${feature._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ feature, isHomebrew })
        }
      );

      const responseData = await response.json();
      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          featureOperationFailed(feature._id, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
        setSubmitted(false);
      } else if (response.status === 422) {
        dispatch(
          featureOperationFailed(feature._id, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
        setSubmitted(false);
      } else if (response.status === 200) {
        console.log(responseData);
        dispatch(updateFeatureSuccess(responseData.data));
        setSubmitted(true);
      } else {
        console.log('Unexpected response status');
        dispatch(
          featureOperationFailed(feature._id, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
        setSubmitted(false);
      }
    } catch (error) {
      dispatch(
        featureOperationFailed(feature._id, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
      setSubmitted(false);
    } 
  };
};

export const deleteFeature = (featureId, token) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/features/feature/${featureId}`,
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
          featureOperationFailed(featureId, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteFeatureSuccess(featureId));
      } else {
        console.log('Unexpected response status');
        dispatch(
          featureOperationFailed(featureId, {
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
      }
    } catch (error) {
      dispatch(
        featureOperationFailed(featureId, {
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
    }
  };
};

export const getSharedFeatures = () => {
  return async dispatch => {
    try {
      dispatch(startFetchingFeatures());
      const response = await fetch('http://localhost:3001/features/shared');
      if (response.status === 200) {
        const features = await response.json();
        dispatch(setSharedFeatures(features));
      } else {
        dispatch(
          fetchFeaturesFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching shared features failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchFeaturesFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching shared features failed'
        })
      );
    }
  };
};

export const getHomebrewFeatures = token => {
  return async dispatch => {
    try {
      dispatch(startFetchingFeatures());
      const response = await fetch('http://localhost:3001/features/homebrew', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (
        response.status === 500 ||
        response.status === 401
      ) {
        const responseData = await response.json();
        dispatch(
          fetchFeaturesFailed({
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        const responseData = await response.json();
        dispatch(setHomebrewFeatures(responseData.features, responseData.featureTypes));
      } else {
        dispatch(
          fetchFeaturesFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching homebrew features failed'
          })
        );
      }
    } catch (error) {
      dispatch(fetchFeaturesFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: 'Fetching homebrew features failed'
      }))
    }
  }
}

export const addFeatureSuccess = feature => {
  return {
    type: FeatureActionTypes.ADD_FEATURE_SUCCESS,
    feature
  };
};

export const updateFeatureSuccess = feature => {
  return {
    type: FeatureActionTypes.UPDATE_FEATURE_SUCCESS,
    feature
  };
};

export const deleteFeatureSuccess = featureId => {
  return {
    type: FeatureActionTypes.DELETE_FEATURE_SUCCESS,
    featureId
  };
};

export const featureOperationFailed = (featureId, error) => {
  return {
    type: FeatureActionTypes.FEATURE_OPERATION_FAILED,
    featureId,
    error
  };
};

export const removeFeatureError = featureId => {
  return {
    type: FeatureActionTypes.REMOVE_FEATURE_ERROR,
    featureId
  };
};

export const startFetchingFeatures = () => {
  return {
    type: FeatureActionTypes.START_FETCHING_FEATURES
  };
};

export const setSharedFeatures = features => {
  return {
    type: FeatureActionTypes.SET_SHARED_FEATURES,
    features
  };
};

export const setHomebrewFeatures = (features, featureTypes) => {
  return {
    type: FeatureActionTypes.SET_HOMEBREW_FEATURES,
    features,
    featureTypes
  };
};

export const fetchFeaturesFailed = error => {
  return {
    type: FeatureActionTypes.FETCH_FEATURES_FAILED,
    error
  };
};

export const registerSaveFeatureCallback = (featureId, callback) => {
  return {
    type: FeatureActionTypes.REGISTER_SAVE_FEATURE_CALLBACK,
    featureId,
    callback
  };
};

export const unregisterSaveFeatureCallback = (featureId) => {
  return {
    type: FeatureActionTypes.UNREGISTER_SAVE_FEATURE_CALLBACK,
    featureId
  };
};
