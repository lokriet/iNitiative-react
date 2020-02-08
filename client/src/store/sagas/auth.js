import { put } from 'redux-saga/effects';
import ErrorType from '../../util/error';

import * as actions from '../actions/index';

export function* registerSaga(action) {
  console.log("I'm in saga!");
  yield put(actions.registerStart());

  try {
    const response = yield fetch('http://localhost:3001/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    });

    console.log(response);
    
    const responseData = yield response.json();
    console.log(responseData);

    if (response.status === 201 || response.status === 422 ) {
      if (responseData.statusCode === 422) {
        yield put(actions.registerFailed({type: ErrorType.VALIDATION_ERROR, data: responseData.data}));
      } else if (responseData.statusCode === 201) {
        yield localStorage.setItem('token', responseData.data.token);
        yield put(actions.registerSuccess(responseData.data));
      }
    } else {
      yield put(actions.registerFailed({type: ErrorType.INTERNAL_ERROR, message: responseData.message}));
    }
  } catch(error) {
    console.log(error);
    yield put(actions.registerFailed({type: ErrorType.INTERNAL_ERROR, message: 'Internal server error occured while authenticating. Please try again.'}));
  }
}

export function* loginSaga(action) {
  console.log("I'm in saga!");
  yield put(actions.loginStart());

  try {
    const response = yield fetch('http://localhost:3001/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(action.payload)
    });

    console.log(response);
    
    const responseData = yield response.json();
    console.log(responseData);

    if (response.status === 200 || response.status === 422 ||  response.status === 401) {
      if (responseData.statusCode === 422) {
        yield put(actions.loginFailed({type: ErrorType.VALIDATION_ERROR, data: responseData.data}));
      } else if (responseData.statusCode === 401) {
        yield put(actions.loginFailed({type: ErrorType.AUTHENTICATION_FAILED, message: responseData.message}));
      } else if (responseData.statusCode === 200) {
        yield localStorage.setItem('token', responseData.data.token);
        yield put(actions.loginSuccess(responseData.data));
      }
    } else {
      yield put(actions.loginFailed({type: ErrorType.INTERNAL_ERROR, message: responseData.message}));
    }
  } catch(error) {
    console.log(error);
    yield put(actions.loginFailed({type: ErrorType.INTERNAL_ERROR, message: 'Internal server error occured while authenticating. Please try again.'}));
  }
}

export function* logoutSaga(action) {
  yield localStorage.removeItem('token');
  yield put(actions.logoutSuccess());
}