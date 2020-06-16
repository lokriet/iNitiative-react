import { createSlice } from '@reduxjs/toolkit';
import constants from '../../util/constants';
import ErrorType from '../../util/error';
import * as actions from '../../store/actions';
// import Firebase from './components/Firebase/firebase';
import {
  firebaseSignInWithCustomToken,
  firebaseSignOut,
  firebaseObtainIdToken
} from '../Firebase/firebaseMiddleware';

const initialState = {
  error: null,
  loading: false,
  token: null,
  user: null,
  redirectPath: '/',
  initialAuthCheckDone: false
  // firebase: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // setFirebase(state, action) {
    //   state.firebase = action.payload.firebase;
    // },

    authInit(state, action) {
      state.loading = false;
      state.error = null;
    },

    authStart(state, action) {
      state.error = null;
      state.loading = true;
    },

    authSuccess(state, action) {
      state.loading = false;
      state.error = null;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    authFailure(state, action) {
      state.token = null;
      state.user = null;
      state.error = action.payload.error;
      state.loading = false;
    },

    logoutSuccess(state, action) {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    setAuthRedirectPath(state, action) {
      state.redirectPath = action.payload.redirectPath;
    },

    authCheckInitialStateDone(state, action) {
      state.initialAuthCheckDone = true;
    },

    authOperationStart(state, action) {
      state.error = null;
      state.loading = true;
    },

    authOperationSuccess(state, action) {
      state.error = null;
      state.loading = false;
    },

    authOperationFailure(state, action) {
      state.error = action.payload.error;
      state.loading = false;
    }
  }
});

export default authSlice.reducer;

export const { authInit, setAuthRedirectPath } = authSlice.actions;

const internalErrorMessage =
  'Internal server error occured while authenticating. Please try again.';

export const authenticate = ({
  email,
  password,
  isRegister,
  rememberMe,
  username
}) => async (dispatch, getState) => {
  dispatch(authSlice.actions.authInit());
  try {
    const url = isRegister
      ? `${constants.serverUrl}/auth/signup`
      : `${constants.serverUrl}/auth/signin`;

    const body = {
      email,
      password
    };
    if (isRegister) {
      body.username = username;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseData = await response.json();

    if (response.status === 500 || response.status === 401) {
      dispatch(
        authSlice.actions.authFailure({
          type: ErrorType[response.status],
          message:
            response.status === 401
              ? responseData.message
              : internalErrorMessage
        })
      );
    } else if (response.status === 422) {
      dispatch(
        authSlice.actions.authFailed({
          type: ErrorType[response.status],
          message: responseData.message
        })
      );
    } else if (response.ok) {
      if (rememberMe) {
        localStorage.setItem('token', responseData.data.token);
      } else {
        localStorage.removeItem('token');
      }
      await dispatch(firebaseSignInWithCustomToken(responseData.data.token));
      dispatch(
        authSlice.actions.authSuccess({
          token: responseData.data.token,
          user: responseData.data.user
        })
      );
    }
  } catch (error) {
    console.log(error);
    dispatch(
      authSlice.actions.authFailure({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: internalErrorMessage
      })
    );
  }
};

export const logout = () => async (dispatch, getState) => {
  localStorage.removeItem('token');
  dispatch(firebaseSignOut());

  dispatch(actions.resetConditionStore());
  dispatch(actions.resetDamageTypeStore());
  dispatch(actions.resetFeatureStore());
  dispatch(actions.resetParticipantTemplateStore());
  dispatch(actions.resetEncounterStore());

  dispatch(authSlice.actions.logoutSuccess());
};

export const authCheckInitialState = () => async (dispatch, getState) => {
  const token = localStorage.getItem('token');

  if (token === null) {
    dispatch(authSlice.actions.authCheckInitialStateDone());
  } else {
    try {
      await dispatch(firebaseSignInWithCustomToken(token));
    } catch (error) {
      localStorage.removeItem('token');
      dispatch(authSlice.actions.authCheckInitialStateDone());
      return;
    }
    
    dispatch(autoLogin(token));
  }
};

export const autoLogin = (token) => async (dispatch, getState) => {
  try {
    await dispatch(firebaseObtainIdToken());
    const firebaseToken = getState().firebase.idToken;
    // console.log('got firebase token', firebaseToken);
    const response = await fetch(`${constants.serverUrl}/users/userinfo`, {
      headers: {
        Authorization: `Bearer ${firebaseToken}`
      }
    });

    const responseData = await response.json();
    dispatch(
      authSlice.actions.authSuccess({
        token,
        user: responseData
      })
    );
  } catch (error) {
    // meow!
  } finally {
    dispatch(authSlice.actions.authCheckInitialStateDone());
  }
};

export const requestPasswordReset = (email, onOperationDone) => async (
  dispatch
) => {
  const errorMessage =
    'Password reset request failed. Please check your internet connection and make sure you are using the correct email address';
  try {
    dispatch(authSlice.actions.authOperationStart());
    const response = await fetch(
      `${constants.serverUrl}/auth/sendPasswordResetEmail`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      }
    );
    if (response.ok) {
      dispatch(authSlice.actions.authOperationSuccess());
      onOperationDone(true);
    } else {
      dispatch(
        authSlice.actions.authOperationFailed({
          type: ErrorType[response.status],
          message: errorMessage
        })
      );
      onOperationDone(false);
    }
  } catch (error) {
    dispatch(
      authSlice.actions.authOperationFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: errorMessage
      })
    );
    onOperationDone(false);
  }
};

export const resetPassword = (
  password,
  resetPasswordToken,
  onOperationDone
) => async (dispatch) => {
  const errorMessage =
    'Password reset failed. Please check your internet connection and make sure you are using the latest requested link from your inbox';

  try {
    dispatch(authSlice.actions.authOperationStart());
    const response = await fetch(`${constants.serverUrl}/auth/resetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        password: password,
        resetPasswordToken: resetPasswordToken
      })
    });
    if (response.ok) {
      dispatch(authSlice.actions.authOperationSuccess());
      onOperationDone(true);
    } else {
      dispatch(
        authSlice.actions.authOperationFailed({
          type: ErrorType[response.status],
          message: errorMessage
        })
      );
      onOperationDone(false);
    }
  } catch (error) {
    dispatch(
      authSlice.actions.authOperationFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: errorMessage
      })
    );
    onOperationDone(false);
  }
};
