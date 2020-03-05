import ErrorType from '../../util/error';
import constants from '../../util/constants';

export const EncounterActionTypes = {
  RESET_ENCOUNTER_OPERATION: 'RESET_ENCOUNTER_OPERATION',
  ADD_ENCOUNTER_SUCCESS: 'ADD_ENCOUNTER_SUCCESS',
  UPDATE_ENCOUNTER_SUCCESS: 'UPDATE_ENCOUNTER_SUCCESS',
  DELETE_ENCOUNTER_SUCCESS: 'DELETE_ENCOUNTER_SUCCESS',
  ENCOUNTER_OPERATION_FAILED: 'ENCOUNTER_OPERATION_FAILED',

  START_FETCHING_ENCOUNTERS: 'START_FETCHING_ENCOUNTERS',
  SET_ENCOUNTERS: 'SET_ENCOUNTERS',
  FETCH_ENCOUNTERS_FAILED: 'FETCH_ENCOUNTERS_FAILED'
};

const INTERNAL_ERROR_MESSAGE = 'Internal error occured. Please try again.';

export const editEncounter = (encounterId, encounter) => {
  return async (dispatch, getState) => {
    try {
      const idToken = await getState().auth.firebase.doGetIdToken();
      let response;
      if (encounterId == null) {
        response = await fetch(
          'http://localhost:3001/encounters/encounter',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ encounter })
          }
        );
      } else {
        // update
        response = await fetch(
          `http://localhost:3001/encounters/encounter/${encounterId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ encounter })
          }
        );
      }

      const responseData = await response.json();
      console.log('got response for encounter edit', responseData);

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          encounterOperationFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? INTERNAL_ERROR_MESSAGE : responseData.message
          })
        );
      } else if (response.status === 422) {
        dispatch(
          encounterOperationFailed({
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (response.status === 201 || response.status === 200) {
        console.log(responseData.data);
        if (encounterId == null) {
          dispatch(addEncounterSuccess(responseData.data));
        } else {
          dispatch(updateEncounterSuccess(responseData.data));
        }
      } else {
        console.log('Unexpected response status');
        dispatch(
          encounterOperationFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: INTERNAL_ERROR_MESSAGE
          })
        );
      }
    } catch(error) {
      dispatch(
        encounterOperationFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: INTERNAL_ERROR_MESSAGE
        })
      );
    }
  }
};

export const deleteEncounter = (encounterId) => {
  return async (dispatch, getState) => {
    try {
      const idToken =  await getState().auth.firebase.doGetIdToken();
      const response = await fetch(
        `http://localhost:3001/encounters/encounter/${encounterId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${idToken}`
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
          encounterOperationFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? INTERNAL_ERROR_MESSAGE : responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteEncounterSuccess(encounterId));
      } else {
        console.log('Unexpected response status');
        dispatch(
          encounterOperationFailed({
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: INTERNAL_ERROR_MESSAGE
          })
        );
      }
    } catch (error) {
      dispatch(
        encounterOperationFailed({
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: INTERNAL_ERROR_MESSAGE
        })
      );
    }
  };
};


export const getEncounters = () => {
  return async (dispatch, getState) => {
    if (
      getState().encounter.encountersInitialised &&
      new Date().getTime() - getState().encounter.encountersInitialised <
      constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(startFetchingEncounters());
      const idToken =  await getState().auth.firebase.doGetIdToken();
      const response = await fetch('http://localhost:3001/encounters', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (
        response.status === 500 ||
        response.status === 401
      ) {
        const responseData = await response.json();
        dispatch(
          fetchEncountersFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? 'Fetching encounters failed' : responseData.message
          })
        );
      } else if (response.status === 200) {
        const encounters = await response.json();
        dispatch(setEncounters(encounters));
      } else {
        dispatch(
          fetchEncountersFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching encounters failed'
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        fetchEncountersFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching encounters failed'
        })
      );
    }
  };
};

export const resetEncounterOperation = () => {
  return {
    type: EncounterActionTypes.RESET_ENCOUNTER_OPERATION
  };
};

export const addEncounterSuccess = encounter => {
  return {
    type: EncounterActionTypes.ADD_ENCOUNTER_SUCCESS,
    encounter
  };
};

export const updateEncounterSuccess = encounter => {
  return {
    type: EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS,
    encounter
  };
};

export const deleteEncounterSuccess = encounterId => {
  return {
    type: EncounterActionTypes.DELETE_ENCOUNTER_SUCCESS,
    encounterId
  };
};

export const encounterOperationFailed = (error) => {
  return {
    type: EncounterActionTypes.ENCOUNTER_OPERATION_FAILED,
    error
  };
};

export const startFetchingEncounters = () => {
  return {
    type: EncounterActionTypes.START_FETCHING_ENCOUNTERS
  };
};

export const setEncounters = encounters => {
  return {
    type: EncounterActionTypes.SET_ENCOUNTERS,
    encounters
  };
};

export const fetchEncountersFailed = error => {
  return {
    type: EncounterActionTypes.FETCH_ENCOUNTERS_FAILED,
    error
  };
};