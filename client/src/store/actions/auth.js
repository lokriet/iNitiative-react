import Firebase from "../../components/Firebase/firebase";

export const AuthActionTypes = {
  SET_FIREBASE: 'SET_FIREBASE',

  AUTHENTICATE: 'AUTHENTICATE',
  AUTH_INIT: 'AUTH_INIT',
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAILED: 'AUTH_FAILED',

  LOGOUT: 'LOGOUT',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',

  AUTH_CHECK_INITIAL_STATE: 'AUTH_CHECK_INITIAL_STATE',
  AUTH_CHECK_INITIAL_STATE_DONE: 'AUTH_CHECK_INITIAL_STATE_DONE',
  SET_AUTH_REDIRECT_PATH: 'SET_AUTH_REDIRECT_PATH'
};

export const initFirebase = () => {
  return dispatch => {
    const firebase = new Firebase();
    dispatch(setFirebase(firebase));
  }
}

export const setFirebase = (firebase) => {
  return {
    type: AuthActionTypes.SET_FIREBASE,
    firebase
  }
}

export const authenticate = (isRegister, payload) => {
  return {
    type: AuthActionTypes.AUTHENTICATE,
    isRegister,
    payload
  };
};

export const authInit = () => {
  return {
    type: AuthActionTypes.AUTH_INIT
  };
};

export const authStart = () => {
  return {
    type: AuthActionTypes.AUTH_START
  };
};

export const authSuccess = authData => {
  return {
    type: AuthActionTypes.AUTH_SUCCESS,
    authData
  };
};

export const authFailed = (error) => {
  return {
    type: AuthActionTypes.AUTH_FAILED,
    error
  };
};

export const logout = () => {
  return {
    type: AuthActionTypes.LOGOUT
  };
};

export const logoutSuccess = () => {
  return {
    type: AuthActionTypes.LOGOUT_SUCCESS
  };
};

export const authCheckInitialState = () => {
  return {
    type: AuthActionTypes.AUTH_CHECK_INITIAL_STATE
  };
};

export const authCheckInitialStateDone = () => {
  return {
    type: AuthActionTypes.AUTH_CHECK_INITIAL_STATE_DONE
  };
};

export const setAuthRedirectPath = redirectPath => {
  return {
    type: AuthActionTypes.SET_AUTH_REDIRECT_PATH,
    redirectPath
  };
};
