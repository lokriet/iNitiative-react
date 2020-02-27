import ErrorType from '../../util/error';
import constants from '../../util/constants';

export const ParticipantTemplateActionTypes = {
  START_PARTICIPANT_TEMPLATE_OPERATION: 'START_PARTICIPANT_TEMPLATE_OPERATION',
  ADD_PARTICIPANT_TEMPLATE_SUCCESS: 'ADD_PARTICIPANT_TEMPLATE_SUCCESS',
  UPDATE_PARTICIPANT_TEMPLATE_SUCCESS: 'UPDATE_PARTICIPANT_TEMPLATE_SUCCESS',
  DELETE_PARTICIPANT_TEMPLATE_SUCCESS: 'DELETE_PARTICIPANT_TEMPLATE_SUCCESS',
  PARTICIPANT_TEMPLATE_OPERATION_FAILED: 'PARTICIPANT_TEMPLATE_OPERATION_FAILED',
  REMOVE_PARTICIPANT_TEMPLATE_ERROR: 'REMOVE_PARTICIPANT_TEMPLATE_ERROR',

  START_FETCHING_PARTICIPANT_TEMPLATES: 'START_FETCHING_PARTICIPANT_TEMPLATES',
  SET_PARTICIPANT_TEMPLATES: 'SET_PARTICIPANT_TEMPLATES',
  SET_EDITED_PARTICIPANT_TEMPLATE: 'SET_EDITED_PARTICIPANT_TEMPLATE',
  FETCH_PARTICIPANT_TEMPLATES_FAILED: 'FETCH_PARTICIPANT_TEMPLATES_FAILED'
};

const INTERNAL_ERROR_MESSAGE = 'Internal error occured. Please try again.';

export const editParticipantTemplate = (templateId, template, setSubmitting) => {
  return async (dispatch, getState) => {
    try {
      const idToken = await getState().auth.firebase.doGetIdToken();
      let response;
      if (templateId == null) {
        // create
        response = await fetch(
          'http://localhost:3001/participantTemplates/template',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ template })
          }
        );
      } else {
        // update
        response = await fetch(
          `http://localhost:3001/participantTemplates/template/${templateId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`
            },
            body: JSON.stringify({ template })
          }
        );
      }

      const responseData = await response.json();
      console.log('got response for participant template edit', responseData);

      if (
        response.status === 500 ||
        response.status === 401 ||
        response.status === 403
      ) {
        dispatch(
          participantTemplateOperationFailed(null, {
            type: ErrorType[response.status],
            message: response.status === 500 ? INTERNAL_ERROR_MESSAGE : responseData.message
          })
        );
      } else if (response.status === 422) {
        dispatch(
          participantTemplateOperationFailed(null, {
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (response.status === 201 || response.status === 200) {
        console.log(responseData.data);
        if (templateId == null) {
          dispatch(addParticipantTemplateSuccess(responseData.data));
        } else {
          dispatch(updateParticipantTemplateSuccess(responseData.data));
        }
      } else {
        console.log('Unexpected response status');
        dispatch(
          participantTemplateOperationFailed(null, {
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: INTERNAL_ERROR_MESSAGE
          })
        );
      }
    } catch (error) {
      dispatch(
        participantTemplateOperationFailed(null, {
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: INTERNAL_ERROR_MESSAGE
        })
      );
    } finally {
      setSubmitting(false);
    }
  };
};

export const deleteParticipantTemplate = (templateId) => {
  return async (dispatch, getState) => {
    try {
      const idToken =  await getState().auth.firebase.doGetIdToken();
      const response = await fetch(
        `http://localhost:3001/participantTemplates/template/${templateId}`,
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
          participantTemplateOperationFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? INTERNAL_ERROR_MESSAGE : responseData.message
          })
        );
      } else if (response.status === 200) {
        dispatch(deleteParticipantTemplateSuccess(templateId));
      } else {
        console.log('Unexpected response status');
        dispatch(
          participantTemplateOperationFailed({
            type: ErrorType.INTERNAL_CLIENT_ERROR,
            message: INTERNAL_ERROR_MESSAGE
          })
        );
      }
    } catch (error) {
      dispatch(
        participantTemplateOperationFailed({
          type: ErrorType.INTERNAL_SERVER_ERROR,
          message: INTERNAL_ERROR_MESSAGE
        })
      );
    }
  };
};

export const getParticipantTemplates = () => {
  return async (dispatch, getState) => {
    if (
      getState().participantTemplate.participantTemplatesInitialised &&
      new Date().getTime() - getState().participantTemplate.participantTemplatesInitialised <
      constants.refreshDataTimeout
    ) {
      return;
    }

    try {
      dispatch(startFetchingParticipantTemplates());
      const idToken =  await getState().auth.firebase.doGetIdToken();
      const response = await fetch('http://localhost:3001/participantTemplates', {
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
          fetchParticipantTemplatesFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? 'Fetching particpiant templates failed' : responseData.message
          })
        );
      } else if (response.status === 200) {
        const participantTemplates = await response.json();
        dispatch(setParticipantTemplates(participantTemplates));
      } else {
        dispatch(
          fetchParticipantTemplatesFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching particpiant templates failed'
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        fetchParticipantTemplatesFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching particpiant templates failed'
        })
      );
    }
  };
};

export const getParticipantTemplateById = (templateId) => {
  return async (dispatch, getState) => {
    try {
      dispatch(startFetchingParticipantTemplates());
      const idToken =  await getState().auth.firebase.doGetIdToken();
      const response = await fetch(`http://localhost:3001/participantTemplates/${templateId}`, {
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
          fetchParticipantTemplatesFailed({
            type: ErrorType[response.status],
            message: response.status === 500 ? 'Fetching particpiant template failed' : responseData.message
          })
        );
      } else if (response.status === 200) {
        const participantTemplate = await response.json();
        dispatch(setEditedParticipantTemplate(participantTemplate));
      } else {
        dispatch(
          fetchParticipantTemplatesFailed({
            type: ErrorType.INTERNAL_SERVER_ERROR,
            message: 'Fetching particpiant template failed'
          })
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        fetchParticipantTemplatesFailed({
          type: ErrorType.INTERNAL_CLIENT_ERROR,
          message: 'Fetching particpiant template failed'
        })
      );
    }
  };
};

export const startParticipantTemplateOperation = () => {
  return {
    type: ParticipantTemplateActionTypes.START_PARTICIPANT_TEMPLATE_OPERATION
  };
};

export const addParticipantTemplateSuccess = participantTemplate => {
  return {
    type: ParticipantTemplateActionTypes.ADD_PARTICIPANT_TEMPLATE_SUCCESS,
    participantTemplate
  };
};

export const updateParticipantTemplateSuccess = participantTemplate => {
  return {
    type: ParticipantTemplateActionTypes.UPDATE_PARTICIPANT_TEMPLATE_SUCCESS,
    participantTemplate
  };
};

export const deleteParticipantTemplateSuccess = participantTemplateId => {
  return {
    type: ParticipantTemplateActionTypes.DELETE_PARTICIPANT_TEMPLATE_SUCCESS,
    participantTemplateId
  };
};

export const participantTemplateOperationFailed = (participantTemplateId, error) => {
  return {
    type: ParticipantTemplateActionTypes.PARTICIPANT_TEMPLATE_OPERATION_FAILED,
    participantTemplateId,
    error
  };
};

export const removeParticipantTemplateError = participantTemplateId => {
  return {
    type: ParticipantTemplateActionTypes.REMOVE_PARTICIPANT_TEMPLATE_ERROR,
    participantTemplateId
  };
};

export const startFetchingParticipantTemplates = () => {
  return {
    type: ParticipantTemplateActionTypes.START_FETCHING_PARTICIPANT_TEMPLATES
  };
};

export const setParticipantTemplates = participantTemplates => {
  return {
    type: ParticipantTemplateActionTypes.SET_PARTICIPANT_TEMPLATES,
    participantTemplates
  };
};

export const setEditedParticipantTemplate = participantTemplate => {
  return {
    type: ParticipantTemplateActionTypes.SET_EDITED_PARTICIPANT_TEMPLATE,
    participantTemplate
  };
};

export const resetEditedParticipantTemplate = () => {
  return {
    type: ParticipantTemplateActionTypes.SET_EDITED_PARTICIPANT_TEMPLATE,
    participantTemplate: null
  };
}

export const fetchParticipantTemplatesFailed = error => {
  return {
    type: ParticipantTemplateActionTypes.FETCH_PARTICIPANT_TEMPLATES_FAILED,
    error
  };
};
