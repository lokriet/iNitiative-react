import { takeEvery } from 'redux-saga/effects';
import * as ActionTypes from '../actions/actionTypes';

import * as auth from './auth';

export function* watchAll() {
  yield takeEvery(ActionTypes.auth.REGISTER, auth.registerSaga);
}
