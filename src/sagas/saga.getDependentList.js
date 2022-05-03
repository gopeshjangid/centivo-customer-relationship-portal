
import {call, put, takeLatest} from 'redux-saga/effects'
import {
     GET_DEPENDENT_LIST_REQUEST,
     GET_DEPENDENT_LIST_SUCCESS,
     GET_DEPENDENT_LIST_FAILURE,
     UPDATE_ACCESS_APPROVAL_REQUEST,
     UPDATE_ACCESS_APPROVAL_SUCCESS,
     UPDATE_ACCESS_APPROVAL_FAILURE,
     RESET_MEMBER_DEPENDENTS_REDUCER,
     } from "../constants"
import { api } from '../services';

function* getDependentsResult(action){
    try{
        const result = yield call(api.getDependentList, action.payload)
        if(result.data && result.status === 200 ){
            yield put({type: GET_DEPENDENT_LIST_SUCCESS, payload:result.data})
        }
        else {
            yield put({type: GET_DEPENDENT_LIST_FAILURE, payload: result.response.data.resultDescription})    
        }
        
    }
    catch(error){
        yield put({type: GET_DEPENDENT_LIST_FAILURE, error})
    }
}

export function* getDependentsWatcherSaga(){
    yield takeLatest(GET_DEPENDENT_LIST_REQUEST, getDependentsResult)
}



function* updateAccessApprovalSaga(action){
    try{
        const result = yield call(api.accessApproval, action.payload);
        
        if(result.status === 200 ){
            const nReqObj = {};
            nReqObj.sessionToken = action.payload.sessionToken;
            nReqObj.memberUuid = action.payload.grantorMemberUuid;
            
            yield put({type: UPDATE_ACCESS_APPROVAL_SUCCESS, payload: result.data})
            yield put({type: RESET_MEMBER_DEPENDENTS_REDUCER})
            yield put({type: GET_DEPENDENT_LIST_REQUEST, payload: nReqObj})
        }
        else {
            yield put({type: UPDATE_ACCESS_APPROVAL_FAILURE, payload: result.response.data.resultDescription})    
        }        
    }
    catch(error){
        yield put({type: UPDATE_ACCESS_APPROVAL_FAILURE, error})
    }
}

export function* updateAccessApprovalWatcherSaga(){
    yield takeLatest(UPDATE_ACCESS_APPROVAL_REQUEST, updateAccessApprovalSaga)
}
