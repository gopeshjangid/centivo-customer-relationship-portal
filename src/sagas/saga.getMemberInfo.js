import {call, put, takeLatest} from 'redux-saga/effects'
import { GET_MEMBER_INFO_REQUEST, GET_MEMBER_INFO_SUCCESS, SET_MEMBER_DETAILS, GET_MEMBER_INFO_FAILURE,
    SET_DEPENDENT_TOGGLE, RESET_ACCOUNT_REQUEST, RESET_ACCOUNT_SUCCESS, RESET_ACCOUNT_FAILURE,
    CLEAR_MEMBER_SEARCH_RESULT, GET_PROFILE_TAB_REQUEST, GET_PROFILE_TAB_SUCCESS, GET_PROFILE_TAB_FAILURE, SET_CALLER_DETAILS, SET_MEMBER_PROFILE } from "../constants"
import { api } from '../services';

function* resetAccountResult(action){
    try{
        const result = yield call(api.resetAccount, action.payload)
        if(result.status === 200 ){
            yield put({type: RESET_ACCOUNT_SUCCESS, payload:result.data})
            yield put({type: GET_PROFILE_TAB_REQUEST, payload:action.payload})
            
        }
        else {
            yield put({type: RESET_ACCOUNT_FAILURE, payload: result.response.data.resultDescription})    
        }
        
    }
    catch(error){
        yield put({type: RESET_ACCOUNT_FAILURE, error})
    }
}

export function* resetAccountWatcherSaga(){
    yield takeLatest(RESET_ACCOUNT_REQUEST, resetAccountResult)
}

function* getMemberInfoResult(action){
    try{
        const result = 
        yield call(api.getMemberInfo, action.payload)
        if(result.data && result.status === 200 ){
            yield put({type: CLEAR_MEMBER_SEARCH_RESULT})
            yield put({type: GET_MEMBER_INFO_SUCCESS, payload:result.data})            
            yield put({type: SET_MEMBER_DETAILS, payload: result.data.memberDetail})
            yield put({type: SET_DEPENDENT_TOGGLE, payload:result.data.memberDetail.eligibilityType})
        }
        else {
            yield put({type: CLEAR_MEMBER_SEARCH_RESULT})
            yield put({type: GET_MEMBER_INFO_FAILURE, payload: result.response.data.resultDescription})    
        }
        
    }
    catch(error){
        yield put({type: GET_MEMBER_INFO_FAILURE, error})
    }
}

export default function* getMemberInfoWatcherSaga(){
    yield takeLatest(GET_MEMBER_INFO_REQUEST, getMemberInfoResult)
}

function* getProfileInfoResult(action){
    try{
        const request = {
            memberUuid: action.payload.memberUuid
        }
        const result = 
        yield call(api.getMemberInfo, request)
        if(result.data && result.status === 200 ){
            yield put({type: CLEAR_MEMBER_SEARCH_RESULT})
            yield put({type: GET_MEMBER_INFO_SUCCESS, payload:result.data})
            yield put({type: SET_DEPENDENT_TOGGLE, payload:result.data.memberDetail.eligibilityType})
            yield put({ type: SET_CALLER_DETAILS, payload: result.data.memberDetail})
            yield put({ type: SET_MEMBER_PROFILE, payload: result.data.profile})
        }
        else {
            yield put({type: CLEAR_MEMBER_SEARCH_RESULT})
            yield put({type: GET_MEMBER_INFO_FAILURE, payload: result.response.data.resultDescription})    
        }
        
    }
    catch(error){
        yield put({type: GET_MEMBER_INFO_FAILURE, error})
    }
}

export function* getProfileInfoWatcherSaga(){
    yield takeLatest(GET_PROFILE_TAB_REQUEST, getProfileInfoResult)
}