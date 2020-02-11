import ErrorType from '../../util/error';

export const DamageTypeActionTypes = {
  ADD_DAMAGE_TYPE_SUCCESS: 'ADD_DAMAGE_TYPE_SUCCESS',
  ADD_DAMAGE_TYPE_FAILED: 'ADD_DAMAGE_TYPE_FAILED'
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

      const responseData = response.json();

      if (response.status === 500 || response.status === 401 || response.status === 403) {
        dispatch(
          addDamageTypeFailed(damageType._id, {
            type: ErrorType[response.status],
            message: responseData.message
          })
        );
        setSubmitting(false);
      } else if (response.status === 422) {
        dispatch(
          addDamageTypeFailed(damageType._id, {
            type: ErrorType[response.status],
            data: responseData.data
          })
        );
      }

      console.log(responseData.data);
      dispatch(addDamageTypeSuccess(responseData.data));
      setSubmitting(false);
    } catch (error) {
      dispatch(addDamageTypeFailed(damageType._id, {
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message:
          'Internal error occured while authenticating. Please try again.'
      }));
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
  return dispatch => {
    fetch(`http://localhost:3001/damageTypes/damageType/${damageType._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ damageType })
    })
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        console.log(responseData.data);
        dispatch(addDamageTypeSuccess(responseData.data));
        setSubmitting(false);
      })
      .catch(error => {
        dispatch(addDamageTypeFailed(damageType._id, error));
        setSubmitting(false);
      });
  };
};

export const addDamageTypeSuccess = damageType => {
  return {
    type: DamageTypeActionTypes.ADD_DAMAGE_TYPE_SUCCESS,
    damageType
  };
};

export const addDamageTypeFailed = (damageTypeId, error) => {
  return {
    type: DamageTypeActionTypes.ADD_DAMAGE_TYPE_FAILED,
    damageTypeId,
    error
  };
};
