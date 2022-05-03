import {call, put, takeLatest} from 'redux-saga/effects'
import { FIND_MEMBER_SUCCESS, FIND_MEMBER_FAILURE, FIND_MEMBER_REQUESTED, SET_FAMILY_ID } from "../constants"
import { api } from '../services'

import {history} from './../helpers/history';

function* getMemberSearchResult(action){
    
    try{
        const result = yield call(api.getMembers, action.payload)
        if(result.data && result.status === 200 ){
            yield put({type: FIND_MEMBER_SUCCESS, payload:result.data})
            
            const familyMembers = result.data.map(member => ({
                ...member,
                memberUuid: window.btoa(member.memberUuid)
              }));
              sessionStorage.setItem(
                'familyMembers',
                JSON.stringify(familyMembers)
              );
        }
        else {
            yield put({type: FIND_MEMBER_FAILURE, payload: result.response.data.error.message})    
        }
       
    }
    catch(error){
        yield put({type: FIND_MEMBER_FAILURE, error})
    }
}

export default function* memberSearchWatcherSaga(){
    yield takeLatest(FIND_MEMBER_REQUESTED, getMemberSearchResult)
}