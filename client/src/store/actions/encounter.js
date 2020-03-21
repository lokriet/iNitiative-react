import ErrorType from '../../util/error';
import constants from '../../util/constants';
import * as actions from './index';

export const EncounterActionTypes = {
  RESET_ENCOUNTER_STORE: 'RESET_ENCOUNTER_STORE',

  RESET_ENCOUNTER_OPERATION: 'RESET_ENCOUNTER_OPERATION',
  ADD_ENCOUNTER_SUCCESS: 'ADD_ENCOUNTER_SUCCESS',
  UPDATE_ENCOUNTER_SUCCESS: 'UPDATE_ENCOUNTER_SUCCESS',
  DELETE_ENCOUNTER_SUCCESS: 'DELETE_ENCOUNTER_SUCCESS',
  ENCOUNTER_OPERATION_FAILED: 'ENCOUNTER_OPERATION_FAILED',
  ENCOUNTER_PARTICIPANT_UPDATE_SUCCESS: 'ENCOUNTER_PARTICIPANT_UPDATE_SUCCESS',
  ENCOUNTER_PARTICIPANT_OPERATION_FAILED:
    'ENCOUNTER_PARTICIPANT_OPERATION_FAILED',

  START_FETCHING_ENCOUNTERS: 'START_FETCHING_ENCOUNTERS',
  SET_ENCOUNTERS: 'SET_ENCOUNTERS',
  SET_EDITED_ENCOUNTER: 'SET_EDITED_ENCOUNTER',
  UPDATE_EDITED_ENCOUNTER: 'UPDATE_EDITED_ENCOUNTER',
  FETCH_ENCOUNTERS_FAILED: 'FETCH_ENCOUNTERS_FAILED'
};

const INTERNAL_ERROR_MESSAGE = 'Internal error occured. Please try again.';

export const EditedEncounterAction = {
  None: 'none',
  Set: 'set',
  Update: 'update'
};

export const editEncounter = (encounterId, encounterData, actionOptions) => {
  return async (dispatch, getState) => {
    let options = {
      editedEncounterAction: EditedEncounterAction.None,
      applyChangesOnError: false,
      overwriteError: true
    };
    if (actionOptions) {
      options = { ...options, ...actionOptions };
    }

    try {
      if (options.applyChangesOnError) {
        dispatch(updateEditedEncounter(encounterData));
      }

      const idToken = await getState().auth.firebase.doGetIdToken();
      let response;
      if (encounterId == null) {
        response = await fetch('http://localhost:3001/encounters/encounter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ encounter: encounterData })
        });
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
            body: JSON.stringify({ partialUpdate: encounterData })
          }
        );
      }

      const responseData = await response.json();

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          encounterOperationFailed({
            type: ErrorType[response.status],
            message:
              response.status === 500
                ? INTERNAL_ERROR_MESSAGE
                : responseData.message
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
        if (encounterId == null) {
          dispatch(addEncounterSuccess(responseData.data));
        } else {
          dispatch(
            updateEncounterSuccess(responseData.data, options.overwriteError)
          );
          if (
            options.editedEncounterAction === EditedEncounterAction.Update &&
            !options.applyChangesOnError
          ) {
            dispatch(updateEditedEncounter(encounterData));
          } else if (
            options.editedEncounterAction === EditedEncounterAction.Set
          ) {
            dispatch(setEditedEncounter(responseData.data));
          }
        }
      } else {
        dispatch(
          encounterOperationFailed(
            {
              type: ErrorType.INTERNAL_SERVER_ERROR,
              message: INTERNAL_ERROR_MESSAGE
            },
            options.overwriteError
          )
        );
      }
    } catch (error) {
      dispatch(
        encounterOperationFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: INTERNAL_ERROR_MESSAGE
        })
      );
    }
  };
};

export const deleteEncounter = encounterId => {
  return async (dispatch, getState) => {
    try {
      const idToken = await getState().auth.firebase.doGetIdToken();

      let avatarUrlsToCheck = [];
      try {
        const avatarsResponse = await fetch(
          `http://localhost:3001/images/encounterAvatarUrls/${encounterId}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`
            }
          }
        );

        if (avatarsResponse.status === 200) {
          avatarUrlsToCheck = await avatarsResponse.json();
        } else {
          console.log(
            'failed to check encounter avatar urls - got unexpected response code'
          );
        }
      } catch (error) {
        console.log('failed to check encounter avatar urls', error);
      }

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
            message:
              response.status === 500
                ? INTERNAL_ERROR_MESSAGE
                : responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteEncounterSuccess(encounterId));
        dispatch(actions.cleanUpAvatarUrls(avatarUrlsToCheck));       
      } else {
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

export const getEncounterById = encounterId => {
  return async (dispatch, getState) => {
    try {
      dispatch(startFetchingEncounters());
      const idToken = await getState().auth.firebase.doGetIdToken();
      const response = await fetch(
        `http://localhost:3001/encounters/${encounterId}`,
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );

      if (response.status === 500 || response.status === 401) {
        const responseData = await response.json();
        dispatch(
          fetchEncountersFailed({
            type: ErrorType[response.status],
            message:
              response.status === 500
                ? 'Fetching encounter failed'
                : responseData.message
          })
        );
      } else if (response.status === 200) {
        const encounter = await response.json();
        dispatch(setEditedEncounter(encounter));
      } else {
        dispatch(
          fetchEncountersFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching encounter failed'
          })
        );
      }
    } catch (error) {
      dispatch(
        fetchEncountersFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching encounter failed'
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
      const idToken = await getState().auth.firebase.doGetIdToken();
      const response = await fetch('http://localhost:3001/encounters', {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (response.status === 500 || response.status === 401) {
        const responseData = await response.json();
        dispatch(
          fetchEncountersFailed({
            type: ErrorType[response.status],
            message:
              response.status === 500
                ? 'Fetching encounters failed'
                : responseData.message
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
      dispatch(
        fetchEncountersFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching encounters failed'
        })
      );
    }
  };
};

export const updateEncounterParticipantDetails = (
  encounterId,
  participantId,
  partialUpdate,
  applyChangesOnError = false
) => {
  return async (dispatch, getState) => {
    try {
      const idToken = await getState().auth.firebase.doGetIdToken();
      let response;
      response = await fetch(
        `http://localhost:3001/encounters/encounter/${encounterId}/participant/${participantId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`
          },
          body: JSON.stringify({ partialUpdate })
        }
      );

      const responseData = await response.json();

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          encounterParticipantOperationFailed({
            type: ErrorType[response.status],
            message:
              response.status === 500
                ? INTERNAL_ERROR_MESSAGE
                : responseData.message,
            applyChangesOnError,
            participantId,
            partialUpdate
          })
        );
      } else if (response.status === 422) {
        dispatch(
          encounterParticipantOperationFailed(
            {
              type: ErrorType.VALIDATION_ERROR,
              data: responseData.data
            },
            applyChangesOnError,
            participantId,
            partialUpdate
          )
        );
      } else if (response.status === 201 || response.status === 200) {
        dispatch(
          encounterParticipantUpdateSuccess(participantId, partialUpdate)
        );
      } else {
        dispatch(
          encounterParticipantOperationFailed(
            {
              type: ErrorType.INTERNAL_SERVER_ERROR,
              message: INTERNAL_ERROR_MESSAGE
            },
            applyChangesOnError,
            participantId,
            partialUpdate
          )
        );
      }
    } catch (error) {
      dispatch(
        encounterParticipantOperationFailed(
          {
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: INTERNAL_ERROR_MESSAGE
          },
          applyChangesOnError,
          participantId,
          partialUpdate
        )
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

export const updateEncounterSuccess = (encounter, overwriteError) => {
  return {
    type: EncounterActionTypes.UPDATE_ENCOUNTER_SUCCESS,
    encounter,
    overwriteError
  };
};

export const deleteEncounterSuccess = encounterId => {
  return {
    type: EncounterActionTypes.DELETE_ENCOUNTER_SUCCESS,
    encounterId
  };
};

export const encounterOperationFailed = (
  error,
  applyChangesOnError,
  encounterId,
  encounterData
) => {
  return {
    type: EncounterActionTypes.ENCOUNTER_OPERATION_FAILED,
    error,
    applyChangesOnError,
    encounterId,
    encounterData
  };
};

export const encounterParticipantOperationFailed = (
  error,
  applyChangesOnError,
  participantId,
  partialUpdate
) => {
  return {
    type: EncounterActionTypes.ENCOUNTER_PARTICIPANT_OPERATION_FAILED,
    error,
    applyChangesOnError,
    participantId,
    partialUpdate
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

export const setEditedEncounter = encounter => {
  return {
    type: EncounterActionTypes.SET_EDITED_ENCOUNTER,
    encounter
  };
};

export const updateEditedEncounter = partialUpdate => {
  return {
    type: EncounterActionTypes.UPDATE_EDITED_ENCOUNTER,
    partialUpdate
  };
};

export const resetEditedEncounter = () => {
  return {
    type: EncounterActionTypes.SET_EDITED_ENCOUNTER,
    encounter: null
  };
};

export const encounterParticipantUpdateSuccess = (
  participantId,
  partialUpdate
) => {
  return {
    type: EncounterActionTypes.ENCOUNTER_PARTICIPANT_UPDATE_SUCCESS,
    participantId,
    partialUpdate
  };
};

export const resetEncounterStore = () => {
  return {
    type: EncounterActionTypes.RESET_ENCOUNTER_STORE
  };
};
