import { put, select } from 'redux-saga/effects';
import ErrorType from '../../util/error';

import * as actions from '../actions/index';
import constants from '../../util/constants';

const INTERNAL_ERROR_MESSAGE =
  'Internal server error occured while authenticating. Please try again.';

export const getFirebase = (state) => state.auth.firebase;

export function* authSaga(action) {
  yield put(actions.authStart());

  try {
    const url = action.isRegister
      ? `${constants.serverUrl}/auth/signup`
      : `${constants.serverUrl}/auth/signin`;

    const body = {
      email: action.payload.email,
      password: action.payload.password
    };
    if (action.isRegister) {
      body.username = action.payload.username;
    }

    const response = yield fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const responseData = yield response.json();

    if (response.status === 500 || response.status === 401) {
      yield put(
        actions.authFailed({
          type: ErrorType[response.status],
          message:
            response.status === 401
              ? responseData.message
              : INTERNAL_ERROR_MESSAGE
        })
      );
    } else if (response.status === 422) {
      yield put(
        actions.authFailed({
          type: ErrorType[response.status],
          message: responseData.message
        })
      );
    } else if (response.status === 200 || response.status === 201) {
      if (action.payload.rememberMe) {
        yield localStorage.setItem('token', responseData.data.token);
      } else {
        yield localStorage.removeItem('token');
      }
      const firebase = yield select(getFirebase);
      yield firebase.doSignInWithCustomToken(responseData.data.token);
      yield put(actions.authSuccess(responseData.data));
    }
  } catch (error) {
    yield put(
      actions.authFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: INTERNAL_ERROR_MESSAGE
      })
    );
  }
}

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  const firebase = yield select(getFirebase);
  yield firebase.doSignOut();

  yield put(actions.resetConditionStore());
  yield put(actions.resetDamageTypeStore());
  yield put(actions.resetFeatureStore());
  yield put(actions.resetParticipantTemplateStore());
  yield put(actions.resetEncounterStore());

  yield put(actions.logoutSuccess());
}

export function* checkAuthStateSaga(action) {
  const token = yield localStorage.getItem('token');

  if (token === null) {
    yield put(actions.authCheckInitialStateDone());
    return;
  }

  try {
    const firebase = yield select(getFirebase);
    yield firebase.doSignInWithCustomToken(token);
    const idToken = yield firebase.doGetIdToken();
    const response = yield fetch(`${constants.serverUrl}/users/userinfo`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    const responseData = yield response.json();
    yield put(
      actions.authSuccess({
        token,
        user: responseData
      })
    );
  } catch (error) {
    // meow!
  } finally {
    yield put(actions.authCheckInitialStateDone());
  }
}

export function* requestPasswordResetSaga(action) {
  const errorMessage =
    'Password reset request failed. Please check your internet connection and make sure you are using the correct email address';
  try {
    yield put(actions.authOperationStart());
    const response = yield fetch(
      `${constants.serverUrl}/auth/sendPasswordResetEmail`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: action.email
        })
      }
    );
    if (response.status === 200) {
      yield put(actions.authOperationSuccess());
      yield action.onOperationDone(true);
    }  else {
      yield put(actions.authOperationFailed({
        type: ErrorType[response.status],
        message: errorMessage
      }));
      yield action.onOperationDone(false);
    }
  } catch (error) {
    yield put(actions.authOperationFailed({
      type: ErrorType.INTERNAL_CLIENT_ERROR,
      message: errorMessage
    }));
    yield action.onOperationDone(false);
  }
}

export function* resetPasswordSaga(action) {
  const errorMessage =
    'Password reset failed. Please check your internet connection and make sure you are using the latest requested link from your inbox';
    try {
      yield put(actions.authOperationStart());
      const response = yield fetch(`${constants.serverUrl}/auth/resetPassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: action.password,
          resetPasswordToken: action.resetPasswordToken
        })
      });
      if (response.status === 200) {
        yield put(actions.authOperationSuccess());
        yield action.onOperationDone(true);
      } else {
        yield put(actions.authOperationFailed({
          type: ErrorType[response.status],
          message: errorMessage
        }));
        yield action.onOperationDone(false);
      }
    } catch (error) {
      yield put(actions.authOperationFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message: errorMessage
      }));
      yield action.onOperationDone(false);
    }
};
