import * as actionType from '../constants/constant.action';

const defaultState = {
  referralsData: null,
  referralError: null,
  memberId: null,
  createReferralsFailure: null,
  createReferralsSuccess: null,
  isPcpReferralAvailable: false,
  specialties: [],
  workflowRequest: false,
  referralWorkflow: null,
  pcploading: false
};

const referralDetails = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_REFERRAL_DATA:
      return Object.assign({}, state, {
        referralsData: action.payload.referrals.resultObject.referrals
      });

    case actionType.SET_REFERRAL_ERROR:
      return Object.assign({}, state, {
        referralError: action.payload.referralError
      });

    case actionType.SET_DEFAULT_STATE_IN_REDUCER:
      return Object.assign({}, defaultState, {
        memberId: action.payload.memberId
      });

    case actionType.SET_REFERRALS_FAILURE:
      return Object.assign({}, defaultState, {
        createReferralsFailure: action.payload.createReferralsFailure
      });

    case actionType.SET_REFERRALS_SUCCESS:
      return Object.assign({}, defaultState, {
        createReferralsSuccess: action.payload.createReferralsSuccess
      });

    case actionType.GET_PCP_REFERRALS_AVAILABLE:
      return Object.assign({}, defaultState, {
        isPcpReferralAvailable: action.payload.isPcpReferralAvailable
      });

    case actionType.GET_REFERRALS_SUCCESS:
      return {
        ...state,
        referralsData: action.payload
      }
    case actionType.GET_REFERRALS_FAILURE:
      return {
        ...state,
        referralsData: []
      }

    case actionType.SPECIALITY_SET_LOADING:
      return {
        ...state,
        pcploading: action.payload.pcploading
      };


    case actionType.GET_SPECIALTIES_SUCCESS:
      const specialties = action.payload.specialtyList.map(specialty => ({
        ...specialty,
        label: specialty.specialty,
        value: specialty.code
      })).sort(function (a, b) {
        if (a["specialty"] > b["specialty"]) {
          return 1;
        } else if (a["specialty"] < b["specialty"]) {
          return -1;
        }
        return 0;
      })

      return {
        ...state,
        specialties,
        workflowRequest: false,
        pcploading: false,
        referralWorkflow: action.payload.referralWorkflow
      }

    case actionType.GET_SPECIALTIES_FAILURE:
      return {
        ...state,
        pcploading: false,
        specialties: action.payload
      }

    default:
      return state;
  }
};

export default referralDetails;
