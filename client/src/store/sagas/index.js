import { takeEvery } from 'redux-saga/effects';
import * as ActionTypes from '../actions/actionTypes';

import * as auth from './auth';

export function* watchAll() {
  yield takeEvery(ActionTypes.auth.AUTHENTICATE, auth.authSaga);
  yield takeEvery(ActionTypes.auth.LOGOUT, auth.logoutSaga);
  yield takeEvery(ActionTypes.auth.AUTH_CHECK_INITIAL_STATE, auth.checkAuthStateSaga);
}
