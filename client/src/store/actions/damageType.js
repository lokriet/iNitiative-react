import ErrorType from '../../util/error';

export const DamageTypeActionTypes = {
  ADD_DAMAGE_TYPE_SUCCESS: 'ADD_DAMAGE_TYPE_SUCCESS',
  UPDATE_DAMAGE_TYPE_SUCCESS: 'UPDATE_DAMAGE_TYPE_SUCCESS',
  DELETE_DAMAGE_TYPE_SUCCESS: 'DELETE_DAMAGE_TYPE_SUCCESS',
  DAMAGE_TYPE_OPERATION_FAILED: 'ADD_DAMAGE_TYPE_FAILED',
  REMOVE_ERROR: 'REMOVE_ERROR',

  START_FETCHING_DAMAGE_TYPES: 'START_FETCHING_DAMAGE_TYPES',
  SET_SHARED_DAMAGE_TYPES: 'SET_SHARED_DAMAGE_TYPES',
  FETCH_DAMAGE_TYPES_FAILED: 'FETCH_DAMAGE_TYPES_FAILED'
};

export const addDamageType = (damageType, isHomebrew, token, setSubmitting) => {
  return async dispatch => {
    try {
      const response = await fetch(
        'http://localhost:3001/damageTypes/damageType',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ damageType, isHomebrew })
        }
      );

      const responseData = await response.json();
      console.log('got response for damage type creation', responseData);

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          damageTypeOperationFailed(null, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 422) {
        dispatch(
          damageTypeOperationFailed(null, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (response.status === 201) {
        console.log(responseData.data);
        dispatch(addDamageTypeSuccess(responseData.data));
      } else {
        console.log('Unexpected response status');
        dispatch(
          damageTypeOperationFailed(null, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
      }
    } catch (error) {
      dispatch(
        damageTypeOperationFailed(null, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
    } finally {
      setSubmitting(false);
    }
  };
};

export const updateDamageType = (
  damageType,
  isHomebrew,
  token,
  setSubmitting
) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/damageTypes/damageType/${damageType._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ damageType, isHomebrew })
        }
      );

      const responseData = await response.json();
      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          damageTypeOperationFailed(damageType._id, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 422) {
        dispatch(
          damageTypeOperationFailed(damageType._id, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (response.status === 200) {
        console.log(responseData);
        dispatch(updateDamageTypeSuccess(responseData.data));
      } else {
        console.log('Unexpected response status');
        dispatch(
          damageTypeOperationFailed(damageType._id, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
      }
    } catch (error) {
      dispatch(
        damageTypeOperationFailed(damageType._id, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
    } finally {
      setSubmitting(false);
    }
  };
};

export const deleteDamageType = (damageTypeId, token) => {
  return async dispatch => {
    try {
      const response = await fetch(
        `http://localhost:3001/damageTypes/damageType/${damageTypeId}`,
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
          damageTypeOperationFailed(damageTypeId, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteDamageTypeSuccess(damageTypeId));
      } else {
        console.log('Unexpected response status');
        dispatch(
          damageTypeOperationFailed(damageTypeId, {
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: 'Internal error occured. Please try again.'
          })
        );
      }
    } catch (error) {
      dispatch(
        damageTypeOperationFailed(damageTypeId, {
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: 'Internal error occured. Please try again.'
        })
      );
    }
  };
};

export const getSharedDamageTypes = () => {
  return async dispatch => {
    try {
      dispatch(startFetchingDamageTypes());
      const response = await fetch('http://localhost:3001/damageTypes/shared');
      if (response.status === 200) {
        const damageTypes = await response.json();
        dispatch(setSharedDamageTypes(damageTypes));
      } else {
        dispatch(
          fetchDamageTypesFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching shared damage types failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchDamageTypesFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching shared damage types failed'
        })
      );
    }
  };
};

export const addDamageTypeSuccess = damageType => {
  return {
    type: DamageTypeActionTypes.ADD_DAMAGE_TYPE_SUCCESS,
    damageType
  };
};

export const updateDamageTypeSuccess = damageType => {
  return {
    type: DamageTypeActionTypes.UPDATE_DAMAGE_TYPE_SUCCESS,
    damageType
  };
};

export const deleteDamageTypeSuccess = damageTypeId => {
  return {
    type: DamageTypeActionTypes.DELETE_DAMAGE_TYPE_SUCCESS,
    damageTypeId
  };
};

export const damageTypeOperationFailed = (damageTypeId, error) => {
  return {
    type: DamageTypeActionTypes.DAMAGE_TYPE_OPERATION_FAILED,
    damageTypeId,
    error
  };
};

export const removeError = damageTypeId => {
  return {
    type: DamageTypeActionTypes.REMOVE_ERROR,
    damageTypeId
  };
};

export const startFetchingDamageTypes = () => {
  return {
    type: DamageTypeActionTypes.START_FETCHING_DAMAGE_TYPES
  };
};

export const setSharedDamageTypes = damageTypes => {
  return {
    type: DamageTypeActionTypes.SET_SHARED_DAMAGE_TYPES,
    damageTypes
  };
};

export const fetchDamageTypesFailed = error => {
  return {
    type: DamageTypeActionTypes.FETCH_DAMAGE_TYPES_FAILED,
    error
  };
};
