import * as actionType from '../constants/constant.action';
import { serviceAPI } from '../services/service.api';
import { setOpenChangePcpModal } from './action.memberCare';

export const getReferrals = memberId => ({
  type:actionType.GET_REFERRALS_REQUEST,
  payload:{
    memberUuid:window.atob(memberId)
  }
})

export const getSpecialties = reqObj => ({
  type:actionType.GET_SPECIALTIES_REQUEST,
  payload:reqObj
});

export const setSpecialityLoading = pcploading => ({
  type: actionType.SPECIALITY_SET_LOADING,
  payload: {
    pcploading: pcploading
  }
});


export const setReferralError = (errorCode, error) => ({
  type: actionType.SET_REFERRAL_ERROR,
  payload: {
    referralError: {
      errorCode: errorCode,
      error: error
    }
  }
});


export const setReferrals = referrals => {
  return {
    type: actionType.SET_REFERRAL_DATA,
    payload: { referrals: referrals }
  };
};


export const setDefaultStateInReducer = memberId => ({
  type: actionType.SET_DEFAULT_STATE_IN_REDUCER,
  payload: {
    memberId: memberId
  }
});

export const createSubmitReferral = requestJSON => ({
  type: actionType.SET_REFERRALS_REQUEST,
  payload: requestJSON
});

export const createReferralsFailure = createReferralsFailure => ({
  type: actionType.SET_REFERRALS_FAILURE,
  payload: { createReferralsFailure }
});

export const createReferralsSuccess = createReferralsSuccess => ({
  type: actionType.SET_REFERRALS_SUCCESS,
  payload: { createReferralsSuccess }
});

export const isPcpReferralAvailable = isPcpReferralAvailable => ({
  type: actionType.GET_PCP_REFERRALS_AVAILABLE,
  payload: { isPcpReferralAvailable }
});
