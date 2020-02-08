import * as ActionTypes from '../actions/actionTypes';

const initialState = {
  error: null,
  loading: false,
  token: null,
  userId: null,
  redirectPath: '/'
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.auth.REGISTER_START:
    case ActionTypes.auth.LOGIN_START:
      return { ...state, error: null, loading: true };
    case ActionTypes.auth.REGISTER_SUCCESS:
    case ActionTypes.auth.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        token: action.authData.token,
        user: action.authData.user
      };
    case ActionTypes.auth.REGISTER_FAILED:
    case ActionTypes.auth.LOGIN_FAILED:
      return {
        ...state,
        token: null,
        userId: null,
        error: action.error,
        loading: false
      };
    case ActionTypes.auth.LOGOUT_SUCCESS: 
      return {
        ...state,
        token: null,
        userId: null,
        error: null,
        loading: false
      }
    case ActionTypes.auth.SET_AUTH_REDIRECT_PATH:
      return {
        ...state,
        redirectPath: action.redirectPath
      };
    default:
      return state;
  }
};

export default authReducer;