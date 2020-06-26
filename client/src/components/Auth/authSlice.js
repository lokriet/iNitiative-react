import {
  createSlice,
  createAction,
  createAsyncThunk
} from '@reduxjs/toolkit';
import {
  firebaseSignInWithCustomToken,
  firebaseSignOut,
  firebaseObtainIdToken
} from '../../store/firebase/firebaseMiddleware';
import { createAuthApi } from './authApi';
import { parseItemOperationError } from '../../store/common/listOperationThunks';

const authApi = createAuthApi();

const authenticationErrorMessage =
  'Internal server error occured while authenticating. Please try again.';
const authenticate = createAsyncThunk(
  '/auth/authenticate',
  async ({ email, password, rememberMe, username, isRegister }, thunkApi) => {
    let response;
    if (isRegister) {
      response = await authApi.register(username, email, password);
    } else {
      response = await authApi.login(email, password);
    }

    if (response.ok) {
      const responseData = await response.json();

      if (rememberMe) {
        localStorage.setItem('token', responseData.data.token);
      } else {
        localStorage.removeItem('token');
      }

      await thunkApi.dispatch(
        firebaseSignInWithCustomToken(responseData.data.token)
      );
      return {
        token: responseData.data.token,
        user: responseData.data.user
      };
    } else {
      const error = await parseItemOperationError(response, authenticationErrorMessage);
      return thunkApi.rejectWithValue(error);
    }
  }
);

const resetStore = createAction('resetStore');
const logout = createAsyncThunk('auth/logout', async (_, thunkApi) => {
  localStorage.removeItem('token');
  thunkApi.dispatch(firebaseSignOut());
  thunkApi.dispatch(resetStore());
  return true;
});

const authCheckInitialState = createAsyncThunk(
  'auth/checkInitialState',
  async (_, thunkApi) => {
    const token = localStorage.getItem('token');

    if (token === null) {
      return true;
    } else {
      try {
        await thunkApi.dispatch(firebaseSignInWithCustomToken(token));
      } catch (error) {
        localStorage.removeItem('token');
        return true;
      }

      thunkApi.dispatch(autoLogin(token));
      return false;
    }
  }
);

const autoLogin = createAsyncThunk(
  'auth/autoLogin',
  async (token, thunkApi) => {
    await thunkApi.dispatch(firebaseObtainIdToken());
    const idToken = thunkApi.getState().firebase.idToken;

    const response = await authApi.fetchUserInfo(idToken);
    if (response.ok) {
      const responseData = await response.json();
      return {
        success: true,
        token,
        user: responseData
      };
    } else {
      return {
        success: false
      };
    }
  }
);

const requestPasswordResetErrorMessage =
  'Password reset request failed. Please check your internet connection and make sure you are using the correct email address';
const requestPasswordResetThunk = createAsyncThunk(
  'auth/requestPasswordReset',
  async ({ email, onOperationDone }, thunkApi) => {
    const response = await authApi.requestPasswordReset(email);

    if (response.ok) {
      onOperationDone(true);
      return true;
    } else {
      const error = await parseItemOperationError(
        response,
        requestPasswordResetErrorMessage
      );
      onOperationDone(false);
      return thunkApi.rejectWithValue(error);
    }
  }
);
const requestPasswordReset = (email, onOperationDone) =>
  requestPasswordResetThunk({ email, onOperationDone });

const resetPasswordErrorMessage =
  'Password reset failed. Please check your internet connection and make sure you are using the latest requested link from your inbox';
const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async ({ password, resetPasswordToken, onOperationDone }, thunkApi) => {
    const response = await authApi.resetPassword(password, resetPasswordToken);
    if (response.ok) {
      onOperationDone(true);
      return true;
    } else {
      const error = await parseItemOperationError(
        response,
        resetPasswordErrorMessage
      );
      onOperationDone(false);
      return thunkApi.rejectWithValue(error);
    }
  }
);
const resetPassword = (password, resetPasswordToken, onOperationDone) =>
  resetPasswordThunk({ password, resetPasswordToken, onOperationDone });

const applyAuthInit = (state, action) => {
  state.loading = false;
  state.error = null;
};

const authSuccess = (state, action) => {
  state.loading = false;
  state.error = null;
  state.token = action.payload.token;
  state.user = action.payload.user;
};

const authCheckInitialStateDone = (state, action) => {
  state.initialAuthCheckDone = true;
};

const authOperationStart = (state, action) => {
  state.error = null;
  state.loading = true;
};

const authOperationSuccess = (state, action) => {
  state.error = null;
  state.loading = false;
};

const authOperationFailure = (state, action) => {
  state.error = action.payload;
  state.loading = false;
};

const initialState = {
  error: null,
  loading: false,
  token: null,
  user: null,
  redirectPath: '/',
  initialAuthCheckDone: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authInit: (state, action) => {
      applyAuthInit(state, action);
      if (action.payload.resetRedirectPath) {
        state.redirectPath = '/'
      }
    },
    setAuthRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    }
  },
  extraReducers: {
    [authenticate.pending]: applyAuthInit,
    [authenticate.fulfilled]: authSuccess,
    [authenticate.rejected]: (state, action) => {
      state.token = null;
      state.user = null;
      state.error = action.payload;
      state.loading = false;
    },

    [logout.fulfilled]: (state, action) => {
      state.token = null;
      state.user = null;
      state.error = null;
      state.loading = false;
    },

    [authCheckInitialState.fulfilled]: (state, action) => {
      if (action.payload) {
        authCheckInitialStateDone(state, action);
      }
    },

    [autoLogin.fulfilled]: (state, action) => {
      if (action.payload.success) {
        authSuccess(state, action);
      }
      authCheckInitialStateDone(state, action);
    },

    [requestPasswordResetThunk.pending]: authOperationStart,
    [requestPasswordResetThunk.fulfilled]: authOperationSuccess,
    [requestPasswordResetThunk.rejected]: authOperationFailure,

    [resetPasswordThunk.pending]: authOperationStart,
    [resetPasswordThunk.fulfilled]: authOperationSuccess,
    [resetPasswordThunk.rejected]: authOperationFailure
  }
});

const selectIsAuthenticated = (state) => state.auth.token != null;
const selectIsAdmin = (state) => state.auth.user && state.auth.user.isAdmin;

//actions
export {
  authCheckInitialState,
  authenticate,
  logout,
  requestPasswordReset,
  resetPassword
};
export const authInit = authSlice.actions.authInit;
export const setAuthRedirectPath = authSlice.actions.setAuthRedirectPath;

//reducer
export default authSlice.reducer;

//selectors
export { selectIsAuthenticated, selectIsAdmin };
