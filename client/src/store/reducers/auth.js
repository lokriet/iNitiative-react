import * as ActionTypes from '../actions/actionTypes';
import { AuthActionTypes } from '../actions';

const initialState = {
  error: null,
  loading: false,
  token: null,
  user: null,
  redirectPath: '/',
  initialAuthCheckDone: false,
  firebase: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthActionTypes.SET_FIREBASE:
      return { ...state, firebase: action.firebase };
    case ActionTypes.auth.AUTH_START:
      return { ...state, error: null, loading: true };
    case ActionTypes.auth.AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        token: action.authData.token,
        user: action.authData.user
      };
    case ActionTypes.auth.AUTH_FAILED:
      return {
        ...state,
        token: null,
        user: null,
        error: action.error,
        loading: false
      };
    case ActionTypes.auth.LOGOUT_SUCCESS:
      return {
        ...state,
        token: null,
        user: null,
        error: null,
        loading: false
      };
    case ActionTypes.auth.SET_AUTH_REDIRECT_PATH:
      return {
        ...state,
        redirectPath: action.redirectPath
      };
    case ActionTypes.auth.AUTH_CHECK_INITIAL_STATE_DONE:
      return {
        ...state,
        initialAuthCheckDone: true
      };
    default:
      return state;
  }
};

export default authReducer;
