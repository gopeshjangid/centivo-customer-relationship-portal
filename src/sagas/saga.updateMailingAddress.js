import { call, put, takeLatest } from 'redux-saga/effects';
import {
    UPDATE_ADDRESS_REQUEST,
    UPDATE_ADDRESS_SUCCESS,
    UPDATE_ADDRESS_FAILURE,
    GET_MEMBER_INFO_REQUEST
} from "../constants";

import { api } from '../services'

function* updateMailingAddressSaga(action) {
    try {
        const result = yield call(api.updateAddress, action.payload)
        if (result.status === 200) {
            yield put({
                type: UPDATE_ADDRESS_SUCCESS
            })

            yield put({
                type:GET_MEMBER_INFO_REQUEST,
                payload: {memberUuid: action.payload.memberUuid}
            })
        }
        else {
            yield put({
                type: UPDATE_ADDRESS_FAILURE
            });
        }

    }
    catch (error) {
        yield put({ type: UPDATE_ADDRESS_FAILURE })
    }
}

export default function* updateMailingAddressWatcherSaga() {
    yield takeLatest(UPDATE_ADDRESS_REQUEST, updateMailingAddressSaga)
}