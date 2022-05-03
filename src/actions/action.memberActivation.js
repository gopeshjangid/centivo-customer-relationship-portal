import * as actionType from '../constants/constant.action';


export const verifyEligibility = payload => ({
  type: actionType.VERIFY_ELIGIBILITY_REQUEST,
  payload
});

export const toggleActivationScreen = payload => ({
  type: actionType.TOGGLE_ACTIVATION_SCREEN,
  payload
});

export const clearActivationError = () => ({
  type: actionType.CLEAR_ACTIVATION_ERROR
});

export const getMembersData = (reqObj) => ({
  type: actionType.GET_MEMBERS_DATA_REQUEST,
  payload: reqObj
})

