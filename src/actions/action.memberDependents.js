import * as actionType from '../constants/constant.action';


 export const getDependentList = reqObj => {
   return {
     type: actionType.GET_DEPENDENT_LIST_REQUEST,
     payload: {
       ...reqObj,
       memberUuid:window.atob(reqObj.memberUuid)
     }
   }
 }


 
export const updateAccessApproval = reqObj => ({
  type: actionType.UPDATE_ACCESS_APPROVAL_REQUEST,
  payload: reqObj
});



export const setLoading = loadingBoolean => ({
  type: actionType.SET_LOADING,
  payload: {
    loading: loadingBoolean
  }
});



export const setDependentInfo = familyMembers => ({
  type: actionType.SET_MEMBER_DEPENDENTS,
  payload: {
    familyMembers: familyMembers
  }
});


export const setNetworkError = networkErrorBoolean => ({
  type: actionType.SET_NETWORK_ERROR_DEPENDENT_API,
  payload: {
    networkError: networkErrorBoolean
  }
});


export const resetMemberDetailsReducer = () => ({
  type: actionType.RESET_MEMBER_DEPENDENTS_REDUCER
});
