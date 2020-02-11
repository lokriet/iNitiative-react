import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  errors: {}, // property keys are ids, for new one - ADD
  damageTypes: []
};

const damageTypesReducer = (state = initialState, action) => {
  switch (action) {
    case ActionTypes.damageType.ADD_DAMAGE_TYPE_SUCCESS:
      let newErrors;
      if (state.errors.ADD != null) {
        newErrors = { ...state.errors };
        delete newErrors.ADD;
      }

      return {
        ...state,
        damageTypes: state.damageTypes.concat(action.damageType),
        errors: newErrors
      };
    case ActionTypes.damageType.ADD_DAMAGE_TYPE_FAILED:
      return {
        ...state,
        errors: {...state.errors, ADD: action.error}
      };
    default:
      return state;
  }
};

export default damageTypesReducer;