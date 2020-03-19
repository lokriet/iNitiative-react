import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  error: null, 
  operationSuccess: false,
  fetching: false,
  participantTemplates: [],
  editedParticipantTemplate: null,
  participantTemplatesInitialised: null // date
};

const participantTemplatesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.participantTemplate.RESET_PARTICIPANT_TEMPLATE_OPERATION:
      return resetParticipantTemplateOperation(state, action);

    case ActionTypes.participantTemplate.ADD_PARTICIPANT_TEMPLATE_SUCCESS:
      return addParticipantTemplateSuccess(state, action);

    case ActionTypes.participantTemplate.UPDATE_PARTICIPANT_TEMPLATE_SUCCESS:
      return updateParticipantTemplateSuccess(state, action);

    case ActionTypes.participantTemplate.DELETE_PARTICIPANT_TEMPLATE_SUCCESS:
      return deleteParticipantTemplateSuccess(state, action);

    case ActionTypes.participantTemplate.PARTICIPANT_TEMPLATE_OPERATION_FAILED:
      return participantTemplateOperationFailed(state, action);

    case ActionTypes.participantTemplate.START_FETCHING_PARTICIPANT_TEMPLATES:
      return startFetchingParticipantTemplates(state, action);

    case ActionTypes.participantTemplate.SET_PARTICIPANT_TEMPLATES:
      return setParticipantTemplates(state, action);
      
    case ActionTypes.participantTemplate.FETCH_PARTICIPANT_TEMPLATES_FAILED:
      return fetchParticipantTemplatesFailed(state, action);
    
    case ActionTypes.participantTemplate.SET_EDITED_PARTICIPANT_TEMPLATE: 
      return setEditedParticipantTemplate(state, action);

    default:
      return state;
  }
};

const resetParticipantTemplateOperation = (state, action) => {
   return {
    ...state,
    error: null,
    operationSuccess: false
  };
};

const addParticipantTemplateSuccess = (state, action) => {
  return {
    ...state,
    participantTemplates: state.participantTemplates
      .concat(action.participantTemplate)
      .sort((a, b) => a.name.localeCompare(b.name)),
    operationSuccess: true,
    error: null
  };
};

const updateParticipantTemplateSuccess = (state, action) => {
  const newParticipantTemplates = state.participantTemplates
    .map(item =>
      item._id.toString() === action.participantTemplate._id.toString()
        ? action.participantTemplate
        : item
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    ...state,
    participantTemplates: newParticipantTemplates,
    operationSuccess: true,
    error: null
  };
};

const deleteParticipantTemplateSuccess = (state, action) => {
  return {
    ...state,
    participantTemplates: state.participantTemplates.filter(
      item => item._id.toString() !== action.participantTemplateId
      ),
    operationSuccess: true,
    error: null
  };
};

const participantTemplateOperationFailed = (state, action) => {
  return {
    ...state,
    operationSuccess: false,
    error: action.error
  };
};

const startFetchingParticipantTemplates = (state, action) => {
  return {
    ...state,
    error: null,
    fetching: true
  };
};

const setParticipantTemplates = (state, action) => {
  return {
    ...state,
    participantTemplates: action.participantTemplates,
    participantTemplatesInitialised: new Date().getTime(),
    fetching: false,
    error: null
  };
};

const setEditedParticipantTemplate = (state, action) => {
  return {
    ...state,
    editedParticipantTemplate: action.participantTemplate,
    fetching: false,
    error: null
  };
};

const fetchParticipantTemplatesFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    error: action.error
  };
};

export default participantTemplatesReducer;
