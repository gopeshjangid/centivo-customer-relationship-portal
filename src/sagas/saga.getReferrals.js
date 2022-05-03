
import {call, put, takeLatest} from 'redux-saga/effects'
import { GET_REFERRALS_REQUEST, GET_REFERRALS_SUCCESS, GET_REFERRALS_FAILURE, 
    GET_SPECIALTIES_REQUEST,
    GET_SPECIALTIES_SUCCESS,
    GET_SPECIALTIES_FAILURE} from "../constants"
import { api } from '../services'

function* getReferralsResult(action){
    try{
        const result = yield call(api.getReferrals, action.payload)
        if(result.data && result.status === 200 ){
            yield put({type: GET_REFERRALS_SUCCESS, payload:result.data})
        }
        else {
            yield put({type: GET_REFERRALS_FAILURE, payload: result.response.data})    
        }
        
    }
    catch(error){
        yield put({type: GET_REFERRALS_FAILURE, error})
    }
}

function* getSpecialtiesResult(action){
    try{
        const result = yield call(api.getSpecialties, action.payload);
        if(result.data && result.status === 200 ){
            yield put({type: GET_SPECIALTIES_SUCCESS, payload:result.data})
        }
        else {
            yield put({type: GET_SPECIALTIES_FAILURE, payload: result.response.data.error.message})    
        }
    }
    catch(e){
        yield put({type: GET_SPECIALTIES_FAILURE, payload: e})    
    }
}

export function* getSpecialtiesWatcherSaga(){
    yield takeLatest(GET_SPECIALTIES_REQUEST, getSpecialtiesResult)
}

export function* getReferralsWatcherSaga(){
    yield takeLatest(GET_REFERRALS_REQUEST, getReferralsResult)
}