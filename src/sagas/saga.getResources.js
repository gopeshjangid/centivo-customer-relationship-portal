import {
    call,
    put,
    takeLatest
    } from 'redux-saga/effects'
import { 
    GET_RESOURCES_REQUEST,
    GET_RESOURCES_SUCCESS,
    GET_RESOURCES_FAILURE
    } from "../constants";
import { api } from '../services';

function* getResourcesResult(action){
    try{
        const result = yield call(api.getResourcesRequest, action.payload)
        yield put({type: GET_RESOURCES_SUCCESS, payload:result.data})
    }
    catch(error){
        yield put({type: GET_RESOURCES_FAILURE, error})
    }
}

export default function* getResourcesWatcherSaga(){
    yield takeLatest(GET_RESOURCES_REQUEST, getResourcesResult)
}