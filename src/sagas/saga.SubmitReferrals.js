
import {call, put, takeLatest} from 'redux-saga/effects'
import { 
    SET_REFERRALS_REQUEST,
    SET_REFERRALS_SUCCESS,
    SET_REFERRALS_FAILURE,
    GET_REFERRALS_REQUEST} from "../constants"
import { api } from '../services'

function* submitReferralsResult(action){
    try{
        const result = yield call(api.submitReferral, action.payload)
        if(result.data && result.status === 200 ){
            yield put({type: SET_REFERRALS_SUCCESS, payload:result.data})
            yield put({type: GET_REFERRALS_REQUEST, payload:{memberUuid:action.payload.memberUuid}})
        }
        else {
            yield put({type: SET_REFERRALS_FAILURE, payload: result.response.data})    
        }
        
    }
    catch(error){
        yield put({type: SET_REFERRALS_FAILURE, error})
    }
}

export function* submitReferralsWatcherSaga(){
    yield takeLatest(SET_REFERRALS_REQUEST, submitReferralsResult)
}