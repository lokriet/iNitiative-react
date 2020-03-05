import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  encounters: [],
  operationError: null,
  operationSuccess: false,
  fetching: false,
  fetchingError: null,
  encountersInitialised: null
};

const encounterReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.encounter.RESET_ENCOUNTER_OPERATION:
      return resetEncounterOperation(state, action);

    case ActionTypes.encounter.ADD_ENCOUNTER_SUCCESS:
      return addEncounterSuccess(state, action);

    case ActionTypes.encounter.DELETE_ENCOUNTER_SUCCESS:
      return deleteEncounterSuccess(state, action);

    case ActionTypes.encounter.ENCOUNTER_OPERATION_FAILED:
      return encounterOperationFailed(state, action);

    case ActionTypes.encounter.START_FETCHING_ENCOUNTERS:
      return startFetchingEncounters(state, action);

    case ActionTypes.encounter.SET_ENCOUNTERS:
      return setEncounters(state, action);

    case ActionTypes.encounter.FETCH_ENCOUNTERS_FAILED:
      return fetchEncountersFailed(state, action);

    default:
      return state;
  }
};

const resetEncounterOperation = (state, action) => {
  return {
    ...state,
    operationError: null,
    operationSuccess: false
  };
};

const addEncounterSuccess = (state, action) => {
  return {
    ...state,
    encounters: [
      {
        _id: action.encounter._id,
        name: action.encounter.name,
        createdAt: new Date(action.encounter.createdAt),
        updatedAt: new Date(action.encounter.updatedAt)
      },
      ...state.encounters
    ],
    operationError: null,
    operationSuccess: true
  };
};

const deleteEncounterSuccess = (state, action) => {
  return {
    ...state,
    encounters: state.encounters.filter(item => item._id.toString() !== action.encounterId),
    operationError: null,
    operationSuccess: true
  };
};

const encounterOperationFailed = (state, action) => {
  return {
    ...state,
    operationSuccess: false,
    operationError: action.error
  };
};

const startFetchingEncounters = (state, action) => {
  return {
    ...state,
    fetchingError: null,
    fetching: true
  };
};

const setEncounters = (state, action) => {
  return {
    ...state,
    encounters: action.encounters.map(item => ({
      _id: item._id,
      name: item.name,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    })),
    encountersInitialised: new Date().getTime(),
    fetching: false,
    fetchingError: null
  };
};

const fetchEncountersFailed = (state, action) => {
  return {
    ...state,
    fetching: false,
    fetchingError: action.error
  };
};

export default encounterReducer;