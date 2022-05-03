
import { call, put, takeLatest } from 'redux-saga/effects'
import {
    VERIFY_ELIGIBILITY_REQUEST, VERIFY_ELIGIBILITY_SUCCESS, VERIFY_ELIGIBILITY_FAILURE,
    TOGGLE_ACTIVATION_SCREEN, CHECK_USERNAME_REQUEST, CHECK_USERNAME_SUCCESS, CHECK_USERNAME_FAILURE,
    CREATE_USER_REQUEST, CREATE_USER_SUCCESS, CREATE_USER_FAILURE, GET_PROFILE_DATA_REQUEST, GET_PROFILE_DATA_SUCCESS, GET_PROFILE_DATA_FAILURE, GET_MEMBERS_DATA_REQUEST, GET_MEMBERS_DATA_SUCCESS, GET_MEMBERS_DATA_FAILURE
} from "../constants"
import { api } from '../services';

function* verifyEligibilityResult(action) {
    try {
        yield put({
            type: TOGGLE_ACTIVATION_SCREEN,
            payload: 'common'
        })
        let { memberUuid, ...restObj } = action.payload;

        const result = yield call(api.verifyEligibilty, restObj)
        if (result.data) {
            yield put({ type: VERIFY_ELIGIBILITY_SUCCESS, payload: result.data.resultObject })
            let reqJson = {
                memberId: action.payload.memberId,
                userName: result.data.resultObject.emailAddr,
                memberUuid: memberUuid
            };
            yield put({
                type: CHECK_USERNAME_REQUEST,
                payload: reqJson
            })
        }
        else {
            yield put({
                type: VERIFY_ELIGIBILITY_FAILURE,
                payload: result.response.data.error.message
            })
        }
    } catch (e) {
        yield put({
            type: VERIFY_ELIGIBILITY_FAILURE,
            payload: e
        })
    }
}

export function* verifyEligibilityWatcherSaga() {
    yield takeLatest(VERIFY_ELIGIBILITY_REQUEST, verifyEligibilityResult)
}

function* checkUsernameResult(action) {
    try {
        let { memberUuid, ...restObj } = action.payload;
        const result = yield call(api.checkUsername, restObj)
        if (result.data) {
            yield put({
                type: CHECK_USERNAME_SUCCESS,
                payload: result.data.resultObject
            })

            let userObj = {
                memberId: action.payload.memberId,
                userName: action.payload.userName,
                memberUuid: memberUuid,
                password: 'Centivo1!',
                paperlessConfirmation: false,
                paperlessEOBConfirmation: false
            };

            yield put({
                type: CREATE_USER_REQUEST,
                payload: userObj
            })
        }
        else {
            yield put({
                type: CHECK_USERNAME_FAILURE,
                payload: result.response.data.error.message
            })
        }
    } catch (e) {
        yield put({
            type: CHECK_USERNAME_FAILURE,
            payload: e
        })
    }
}

export function* checkUsernameWatcherSaga() {
    yield takeLatest(CHECK_USERNAME_REQUEST, checkUsernameResult)
}



function* createUserResult(action) {
    try {
        const result = yield call(api.createUser, action.payload)
        if (result.data) {
            yield put({
                type: CREATE_USER_SUCCESS,
                payload: result.data.resultObject
            })
            yield put({
                type: TOGGLE_ACTIVATION_SCREEN,
                payload: 'planDetails'
            })

            yield put({
                type: GET_PROFILE_DATA_REQUEST,
                payload: {
                    memberUuid: action.payload.memberUuid
                }
            })

        }
        else {
            yield put({
                type: CREATE_USER_FAILURE,
                payload: result.response.data.error.message
            })
        }
    } catch (e) {
        yield put({
            type: CREATE_USER_FAILURE,
            payload: e
        })
    }
}

export function* createUserWatcherSaga() {
    yield takeLatest(CREATE_USER_REQUEST, createUserResult)
}

function* getProfileResult(action) {
    try {
        const result = yield call(api.getMemberInfo, action.payload)
        if (result.data) {
            yield put({
                type: GET_PROFILE_DATA_SUCCESS,
                payload: result.data.profile
            })
        }
        else {
            yield put({
                type: GET_PROFILE_DATA_FAILURE,
                payload: result.response.data.error.message
            })
        }
    } catch (e) {
        yield put({
            type: GET_PROFILE_DATA_FAILURE,
            payload: e
        })
    }
}

export function* getProfileWatcherSaga() {
    yield takeLatest(GET_PROFILE_DATA_REQUEST, getProfileResult)
}

function* getMembersDataResult(action) {
    try {
        yield put({
            type: TOGGLE_ACTIVATION_SCREEN,
            payload: 'common'
        })
        const result = yield call(api.getMembersData, action.payload)
        if (result.data) {
            yield put({
                type: GET_MEMBERS_DATA_SUCCESS,
                payload: result.data
            })
            yield put({
                type: TOGGLE_ACTIVATION_SCREEN,
                payload: 'familyMembers'
            })
        }
        else {
            yield put({
                type: GET_MEMBERS_DATA_FAILURE,
                payload: result.response.data.error.message
            })
        }
    } catch (e) {
        yield put({
            type: GET_MEMBERS_DATA_FAILURE,
            payload: e
        })
    }
}

export function* getMembersDataWatcherSaga() {
    yield takeLatest(GET_MEMBERS_DATA_REQUEST, getMembersDataResult)
}