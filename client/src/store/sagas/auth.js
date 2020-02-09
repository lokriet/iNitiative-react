// import { push } from 'react-router-redux';
import { put } from 'redux-saga/effects';
import ErrorType from '../../util/error';

import * as actions from '../actions/index';

// import createHistory from 'history/createBrowserHistory';
// const history = createHistory();

export function* registerSaga(action) {
  console.log("I'm in saga!");
  yield put(actions.authStart());

  try {
    const response = yield fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: action.payload.username,
        email: action.payload.email,
        password: action.payload.password
      })
    });

    console.log(response);

    const responseData = yield response.json();
    console.log(responseData);

    if (response.status === 201 || response.status === 422) {
      if (responseData.statusCode === 422) {
        yield put(
          actions.authFailed({
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (responseData.statusCode === 201) {
        if (action.payload.rememberMe) {
          yield localStorage.setItem('token', responseData.data.token);
        } else {
          yield localStorage.removeItem('token');
        }
        yield put(actions.authSuccess(responseData.data));
      }
    } else {
      yield put(
        actions.authFailed({
          type: ErrorType.INTERNAL_ERROR,
          message: responseData.message
        })
      );
    }
  } catch (error) {
    console.log(error);
    yield put(
      actions.authFailed({
        type: ErrorType.INTERNAL_ERROR,
        message:
          'Internal server error occured while authenticating. Please try again.'
      })
    );
  }
}

export function* loginSaga(action) {
  console.log("I'm in saga!");
  yield put(actions.authStart());

  try {
    const response = yield fetch('http://localhost:3001/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: action.payload.email,
        password: action.payload.password
      })
    });

    console.log(response);

    const responseData = yield response.json();
    console.log(responseData);

    if (
      response.status === 200 ||
      response.status === 422 ||
      response.status === 401
    ) {
      if (responseData.statusCode === 422) {
        yield put(
          actions.authFailed({
            type: ErrorType.VALIDATION_ERROR,
            data: responseData.data
          })
        );
      } else if (responseData.statusCode === 401) {
        yield put(
          actions.authFailed({
            type: ErrorType.AUTHENTICATION_FAILED,
            message: responseData.message
          })
        );
      } else if (responseData.statusCode === 200) {
        if (action.payload.rememberMe) {
          yield localStorage.setItem('token', responseData.data.token);
        } else {
          yield localStorage.removeItem('token');
        }
        yield put(actions.authSuccess(responseData.data));
      }
    } else {
      yield put(
        actions.authFailed({
          type: ErrorType.INTERNAL_ERROR,
          message: responseData.message
        })
      );
    }
  } catch (error) {
    console.log(error);
    yield put(
      actions.authFailed({
        type: ErrorType.INTERNAL_ERROR,
        message:
          'Internal server error occured while authenticating. Please try again.'
      })
    );
  }
}

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield put(actions.logoutSuccess());
}

export function* checkAuthStateSaga(action) {
  const token = yield localStorage.getItem('token');

  if (token === null) {
    yield put(actions.authCheckInitialStateDone());
    return;
  }

  try {
    const response = yield fetch('http://localhost:3001/users/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const responseData = yield response.json();
    yield put(
      actions.authSuccess({
        token,
        user: responseData
      })
    );
    yield put(actions.authCheckInitialStateDone());
  } catch (error) {
    console.log(error);
  }
}
