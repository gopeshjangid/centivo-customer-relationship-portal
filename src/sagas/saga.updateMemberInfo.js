import {call, put, takeLatest} from 'redux-saga/effects'
import { UPDATE_MEMBER_INFO_REQUEST, CLEAR_MEMBER_SEARCH_RESULT, TOGGLE_GET_MEMBER_INFO_SUCCESS, SET_DEPENDENT_TOGGLE, UPDATE_MEMBER_INFO_SUCCESS, UPDATE_MEMBER_INFO_FAILURE, CLEAR_ERROR_MESSAGE, GET_MEMBER_INFO_REQUEST } from "../constants"
import { api } from '../services'

function* updateMemberInfoResult(action){
    try{
        const {dependantMemberStatus, ...actionInput} = action.payload;
        const result = yield call(api.updateMemberUserData, actionInput)
        
        if(result && result.status === 200 ){
            yield put({type: UPDATE_MEMBER_INFO_SUCCESS, payload:actionInput})
            
            if(!dependantMemberStatus){
                yield put({type: GET_MEMBER_INFO_REQUEST, payload:{
                    memberUuid:actionInput.memberUuid
                }})
            }
            else{
                const memberUuid = {memberUuid:actionInput.memberUuid};
                const result = yield call(api.getMemberInfo, memberUuid)
                if(result.data && result.status === 200 ){
                    yield put({type: CLEAR_MEMBER_SEARCH_RESULT})
                    yield put({type: TOGGLE_GET_MEMBER_INFO_SUCCESS, payload:result.data})
                    yield put({type: SET_DEPENDENT_TOGGLE, payload:result.data.memberDetail.eligibilityType})
                }
            }            

        }
        else {
            yield put({type: UPDATE_MEMBER_INFO_FAILURE, payload: result.response.data.resultDescription});
            setTimeout(function* (){
                yield put({type: CLEAR_ERROR_MESSAGE});
            },1000)
        }
        
    }
    catch(error){
        yield put({type: UPDATE_MEMBER_INFO_FAILURE, error})
    }
}

export default function* updateMemberInfoWatcherSaga(){
    yield takeLatest(UPDATE_MEMBER_INFO_REQUEST, updateMemberInfoResult)
}