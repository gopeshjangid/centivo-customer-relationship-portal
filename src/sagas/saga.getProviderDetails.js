
import {call, put, takeLatest} from 'redux-saga/effects'
import { 
    GET_LOCATION_SUCCESS,
    GET_LOCATION_REQUESTED,
    GET_LOCATION_FAILURE
} from "../constants"
import { api } from '../services'

function* getLocationSaga(action) {
    try {
      const result = yield call(api.getGMAPKey, action.payload);
      yield put({ type: GET_LOCATION_SUCCESS, payload: result });
    } catch (error) {
      yield put({ type: GET_LOCATION_FAILURE, error });
    }
  }

export function* getLocationWatcherSaga() {
    yield takeLatest(GET_LOCATION_REQUESTED, getLocationSaga);
  }