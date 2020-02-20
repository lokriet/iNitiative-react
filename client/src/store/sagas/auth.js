// import { push } from 'react-router-redux';
import { put, select } from 'redux-saga/effects';
import ErrorType from '../../util/error';

import * as actions from '../actions/index';

// import createHistory from 'history/createBrowserHistory';
// const history = createHistory();

export const getFirebase = (state) => state.auth.firebase;

export function* authSaga(action) {
  console.log("I'm in saga!");
  yield put(actions.authStart());

  try {
    const url = action.isRegister
      ? 'http://localhost:3001/auth/signup'
      : 'http://localhost:3001/auth/signin';

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

    console.log(response);

    const responseData = yield response.json();
    console.log(responseData);

    if (response.status === 500 || response.status === 401) {
      yield put(
        actions.authFailed({
          type: ErrorType[response.status],
          message: responseData.message
        })
      );
    } else if (response.status === 422) {
      yield put(
        actions.authFailed({
          type: ErrorType[response.status],
          data: responseData.data
        })
      );
    } else if (response.status === 200 || response.status === 201) {
      if (action.payload.rememberMe) {
        yield localStorage.setItem('token', responseData.data.token);
      } else {
        yield localStorage.removeItem('token');
      }
      const firebase = yield select(getFirebase);
      const firebaseLoginResult = yield firebase.doSignInWithCustomToken(responseData.data.token);
      console.log('firebase login result: ', firebaseLoginResult);
      yield put(actions.authSuccess(responseData.data));
    }
  } catch (error) {
    console.log(error);
    yield put(
      actions.authFailed({
        type: ErrorType.INTERNAL_CLIENT_ERROR,
        message:
          'Internal server error occured while authenticating. Please try again.'
      })
    );
  }
}

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  const firebase = yield select(getFirebase);
  yield firebase.doSignOut();
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
    const firebaseLoginResult = yield firebase.doSignInWithCustomToken(token);
    console.log('firebase login result: ', firebaseLoginResult);
    const idToken = yield firebase.doGetIdToken();
    const response = yield fetch('http://localhost:3001/users/userinfo', {
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
    // yield put(actions.authFailed(error));
    console.log(error);
  } finally {
    yield put(actions.authCheckInitialStateDone());
  }
}
