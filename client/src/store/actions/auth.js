export const AuthActionTypes = {
  REGISTER: 'REGISTER',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILED: 'REGISTER_FAILED',
  LOGIN: 'LOGIN',
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',

  LOGOUT: 'AUTH_INITIATE_LOGOUT',
  LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',

  AUTH_CHECK_INITIAL_STATE: 'AUTH_CHECK_INITIAL_STATE',
  SET_AUTH_REDIRECT_PATH: 'SET_AUTH_REDIRECT_PATH'
};

export const register = payload => {
  return {
    type: AuthActionTypes.REGISTER,
    payload
  };
};

export const registerStart = () => {
  return {
    type: AuthActionTypes.REGISTER_START
  };
};

export const registerSuccess = authData => {
  return {
    type: AuthActionTypes.REGISTER_SUCCESS,
    authData
  };
};

export const registerFailed = (error) => {
  return {
    type: AuthActionTypes.REGISTER_FAILED,
    error
  };
};

export const login = payload => {
  return {
    type: AuthActionTypes.LOGIN,
    payload
  };
};

export const loginStart = () => {
  return {
    type: AuthActionTypes.LOGIN_START
  };
};

export const loginSuccess = () => {
  return {
    type: AuthActionTypes.LOGIN_SUCCESS
  };
};

export const loginFailed = () => {
  return {
    type: AuthActionTypes.LOGIN_FAILED
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

export const setAuthRedirectPath = redirectPath => {
  return {
    type: AuthActionTypes.SET_AUTH_REDIRECT_PATH,
    redirectPath
  };
};
