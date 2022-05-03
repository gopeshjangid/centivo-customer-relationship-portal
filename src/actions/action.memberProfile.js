import * as actionType from '../constants/constant.action';
import { batchActions } from 'redux-batched-actions';

export const getMemberInfo = memberUuid => {
  return {
  type:actionType.GET_MEMBER_INFO_REQUEST,
  payload:memberUuid
  }
}

export const loadTab = identifier => ({
  type: actionType.GET_TAB_INFO,
  payload: {
    identifier: identifier
  }
});


export const getProfileTabInfo = (reqObj) => ({
  type: actionType.GET_PROFILE_TAB_REQUEST,
  payload: reqObj
})


export const updateAddressRequest = reqObj => ({
  type: actionType.UPDATE_ADDRESS_REQUEST,
  payload: reqObj
})


export const updateMemberInfo = (reqObj, updateField) => ({
        type:actionType.UPDATE_MEMBER_INFO_REQUEST,
        payload: reqObj
      })

export const resetAccount = memberUuid => ({
  type:actionType.RESET_ACCOUNT_REQUEST,
  payload:{
    memberUuid:window.atob(memberUuid)
  }
})

export const updateTabInfo = statusArray => ({
  type: actionType.UPDATE_TAB_INFO,
  payload: {
    tabInfo: statusArray
  }
});


export const resetTabInfo = () => ({
  type: actionType.RESET_TAB_INFO
});

export const setLoading = loadingBoolean => ({
  type: actionType.SET_LOADING,
  payload: {
    loading: loadingBoolean
  }
});

export const setCallerMemberId = memberID => ({
  type: actionType.SET_CALLER_MEMBERID,
  payload: {
    callerId: memberID
  }
});


export const setMemberId = memberID => ({
  type: actionType.SET_MEMBER_MEMBERID,
  payload: {
    memberId: memberID
  }
});

export const setCallerDetails = memberDetails => ({
  type: actionType.SET_CALLER_DETAILS,
  payload: {
    callerDetails: memberDetails
  }
});

export const setMemberDetails = memberDetails => ({
  type: actionType.SET_MEMBER_DETAILS,
  payload: {
    memberDetails: memberDetails
  }
});


export const setMemberProfile = profileDetails => ({
  type: actionType.SET_MEMBER_PROFILE,
  payload: {
    profileDetails: profileDetails
  }
});


export const setDependentAccessApproval = accessApproval => ({
  type: actionType.SET_MEMBER_ACCESS_ON_DEPENDENT,
  payload: {
    accessApprovalLevel: accessApproval
  }
});

export const resetMemberDetailsReducer = () => ({
  type: actionType.RESET_MEMBER_DETAILS_REDUCER
});

export const updateWithNewMemberInfo = (
  email,
  phone,
  paperless,
  preferenceEmail,
  preferenceSms
) => dispatch => {
  dispatch({
    type: actionType.UPDATE_WITH_NEW_MEMBER_INFO,
    payload: {
      email: email,
      phone: phone,
      paperless: paperless,
      communicationPreference: {
        email: preferenceEmail,
        sms: preferenceSms
      }
    }
  });
};

export const newFieldUpdateError = respMsg => dispatch => {
  dispatch({
    type: actionType.NEW_FIELD_UPDATE_ERROR,
    payload: {
      respMsg: respMsg
    }
  });
};

export const newFieldUpdateSuccess = () => dispatch => {
  dispatch({
    type: actionType.NEW_FIELD_UPDATE_SUCCESS,
    payload: {
      newFieldUpdateSuccess: true
    }
  });
};

export const newUpdateEmailAddress = email => dispatch => {
  dispatch({
    type: actionType.NEW_UPDATE_EMAIL_ADDRESS,
    payload: {
      email: email
    }
  });
};

export const newUpdatePhoneNumber = phoneNmr => dispatch => {
  dispatch({
    type: actionType.NEW_UPDATE_PHONE_NUMBER,
    payload: {
      phoneNmr: phoneNmr
    }
  });
};

export const newUpdatePaperlessPreference = paperless => dispatch => {
  dispatch({
    type: actionType.NEW_UPDATE_PAPERLESS_PREFERENCE,
    payload: {
      paperless: paperless
    }
  });
};

export const newUpdateEmailPreference = emailPreferece => dispatch => {
  dispatch({
    type: actionType.NEW_UPDATE_EMAIL_PREFERENCE,
    payload: {
      emailPreferece: emailPreferece
    }
  })
};

export const newUpdateSmsPreference = smsPreference => dispatch => {
  dispatch({
    type: actionType.NEW_UPDATE_SMS_PREFERENCE,
    payload: {
      smsPreference: smsPreference
    }
  })
};

export const newUpdateAddress = (reqObj) =>  ({
    type: actionType.UPDATE_ADDRESS_REQUEST,
    payload: reqObj
  })

// export const setDependentToggle = isDependentType => dispatch => {
//   dispatch({
//     type: actionType.SET_DEPENDENT_TOGGLE,
//     payload: {
//       isDependentType: isDependentType
//     }
//   })
// };

export const setDependentToggle = isDependentType => ({
  type: actionType.SET_DEPENDENT_TOGGLE,
  payload: {
    isDependentType: isDependentType
  }
})


export const resetAccountSuccess = value => ({
  type: actionType.RESET_ACCOUNT,
  payload: {
    isResetSuccessMsg: value
  }
});

export const setNetworkError = networkErrorBoolean => ({
  type: actionType.SET_NETWORK_ERROR_DEPENDENT_API,
  payload: {
    networkError: networkErrorBoolean
  }
})

export const toggleAddressModal = (payload) => ({
  type: actionType.TOGGLE_ADDRESS_MODAL,
  payload
})