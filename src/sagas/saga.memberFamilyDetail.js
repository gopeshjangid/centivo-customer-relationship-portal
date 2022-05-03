import {call, put, takeLatest} from 'redux-saga/effects'
import { 
    GET_FAMILY_MEMBER_REQUEST, 
    GET_FAMILY_MEMBER_SUCCESS,
    GET_FAMILY_MEMBER_FAILURE,
    GET_TAB_INFO
} from "../constants"

import { api } from '../services'

function* getFamilyMemberSaga(action){
    try{
        const result = yield call(api.getMemberInfo, action.payload)
        if(result.status === 200 ){
            yield put({type: GET_FAMILY_MEMBER_SUCCESS, payload:result.data})
               yield put({type: GET_TAB_INFO, payload: {
                   identifier: 'profile'
                }})
        }
        else {
            yield put({type: GET_FAMILY_MEMBER_FAILURE, payload: result})    
        }
    }
    catch(error){
        yield put({type: GET_FAMILY_MEMBER_FAILURE, payload: error})
    }
}

export default function* getFamilyMemberWatcherSaga(){
    yield takeLatest(GET_FAMILY_MEMBER_REQUEST, getFamilyMemberSaga)
}