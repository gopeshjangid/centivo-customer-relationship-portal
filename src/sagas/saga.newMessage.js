import { delay, all, call, put, takeLatest } from 'redux-saga/effects'
import {
    GET_ALL_TEMPLATES_REQUEST, GET_ALL_TEMPLATES_SUCCESS, GET_ALL_TEMPLATES_FAILURE, FIND_MASTER_PLANS_REQUEST, FIND_MASTER_PLANS_SUCCESS, FIND_MASTER_PLANS_FAILURE, CREATE_MESSAGE_REQUEST,
    CREATE_MESSAGE_SUCCESS, CREATE_MESSAGE_FAILURE, GET_MEMBERS_BY_FAMILY_ID_REQUEST, GET_MEMBERS_BY_FAMILY_ID_SUCCESS,
    GET_MEMBERS_BY_FAMILY_ID_FAILURE, RESET_CONFIRMATION_MODAL
} from "../constants"
import { api } from '../services'
import { history } from './../helpers';

function* getMembersByFamilyIdResult(action) {
    try {
        const result = yield call(api.findMember, action.payload)
        if(result.data && result.status === 200 ){
            yield put({ type: GET_MEMBERS_BY_FAMILY_ID_SUCCESS, payload: result.data.members })
        }
        else {
            yield put({ type: GET_MEMBERS_BY_FAMILY_ID_FAILURE, payload: result.data.members })
        }
    }
    catch (error) {
        yield put({ type: GET_MEMBERS_BY_FAMILY_ID_FAILURE, error })
    }
}


export function* getMembersByFamilyIdWatcherSaga() {
    yield takeLatest(GET_MEMBERS_BY_FAMILY_ID_REQUEST, getMembersByFamilyIdResult)
}

function* createMessageResult(action) {
    let success_msg = '<span class="display-block">Your message has</span><span class="display-block">been sent</span>'
    let failure_msg = '<span class="display-block">Your message couldn\'t</span><span class="display-block">be sent</span>'
    try {
        const result = yield call(api.createMessage, action.payload);
        if(result.data && result.status === 200 ){
                yield put({ type: CREATE_MESSAGE_SUCCESS, payload: success_msg })
        }
        else {
            yield put({ type: CREATE_MESSAGE_FAILURE, payload: failure_msg })
        }

    }
    catch (error) {
        yield put({ type: CREATE_MESSAGE_FAILURE, error })
    }
}


export function* createMessageWatcherSaga() {
    yield takeLatest(CREATE_MESSAGE_REQUEST, createMessageResult)
}

function* findMasterPlansResult(action) {
    try {
        const result = yield call(api.findMasterPlans)
        if (result.data) {
            yield put({ type: FIND_MASTER_PLANS_SUCCESS, payload: result.data })
        }
        else {
            yield put({ type: FIND_MASTER_PLANS_FAILURE, payload: result.data.resultDescription })
        }

    }
    catch (error) {
        yield put({ type: FIND_MASTER_PLANS_FAILURE, error })
    }
}


export function* findMasterPlansWatcherSaga() {
    yield takeLatest(FIND_MASTER_PLANS_REQUEST, findMasterPlansResult)
}

function* getAllTemplatesResult(action) {
    try {
        const result = yield call(api.getAllTemplates)
        if(result.data && result.status === 200 ){
            yield put({ type: GET_ALL_TEMPLATES_SUCCESS, payload: result.data.resultObject })
        }
        else {
            yield put({ type: GET_ALL_TEMPLATES_FAILURE, payload: result.data.resultDescription })
        }

    }
    catch (error) {
        yield put({ type: GET_ALL_TEMPLATES_FAILURE, error })
    }
}


export default function* getAllTemplatesWatcherSaga() {
    yield takeLatest(GET_ALL_TEMPLATES_REQUEST, getAllTemplatesResult)
}