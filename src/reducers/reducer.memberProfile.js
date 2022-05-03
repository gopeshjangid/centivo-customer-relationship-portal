
import * as actionType from '../constants/constant.action';

const defaultState = {
  loading: false,
  callerInfo: {},
  memberInfo: {
    isDependentType: undefined,
    isFieldUpdated: true,
    isFieldError: false,
    respMsg: undefined,
    updateSuccess: undefined,
    updateAddressFail: undefined,
    updateAddressSuccess: undefined
  },
  profile: {
    email: undefined,
    phone: undefined,
    paperless: undefined,
    communicationPreference: {
      email: undefined,
      sms: undefined
    },
    primaryAddress: {}
  },
  emailEditFlag: false,
  tabArray: [
    {
      key: '1',
      identifier: 'profile',
      name: 'Profile',
      isActive: true,
      visible: true
    },
    {
      key: '2',
      identifier: 'family',
      name: 'Family',
      isActive: false,
      visible: true
    },
    {
      key: '3',
      identifier: 'care',
      name: 'Care',
      isActive: false,
      visible: true
    },
    {
      key: '4',
      identifier: 'referral',
      name: 'Referral',
      isActive: false,
      visible: true
    },
    {
      key: '5',
      identifier: 'messages',
      name: 'Messages',
      isActive: false,
      visible: true
    }
  ],
  isResetSuccessMsg: false
};

const memberProfile = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };

    case actionType.GET_TAB_INFO:
      return {
        ...state,
        tabArray: state.tabArray.map(tabArray =>
          tabArray.identifier === action.payload.identifier
            ? {
              ...tabArray,
              isActive: true
            }
            : {
              ...tabArray,
              isActive: false
            }
        )
      };

    case actionType.RESET_TAB_INFO:
      return {
        ...state,
        tabArray: state.tabArray.map(tabArray => ({
          ...tabArray,
          visible: true
        }))
      };

    case actionType.SET_CALLER_MEMBERID:
      return {
        ...state,
        callerInfo: {
          ...state.callerInfo,
          id: action.payload.callerId
        }
      };

    // case actionType.SET_CALLER_DETAILS:
    //   return {
    //     ...state,
    //     loading:false,
    //     callerInfo: {
    //       ...state.callerInfo,
    //       details: action.payload
    //     }
    //   };

    case actionType.SET_MEMBER_MEMBERID:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          id: action.payload.memberId
        }
      };

    case actionType.SET_MEMBER_PROFILE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: action.payload.profileDetails
        }
      };

    case actionType.SET_MEMBER_DETAILS:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          details: action.payload
        }
      };

    case actionType.SET_MEMBER_ACCESS_ON_DEPENDENT:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          accessOnDependent: action.payload.accessApprovalLevel
        }
      };

    case actionType.UPDATE_TAB_INFO:
      return {
        ...state,
        tabArray: state.tabArray.map(tabArray => {
          return tabArray.identifier === action.payload.tabInfo.identifier
            ? {
              ...tabArray,
              visible: action.payload.tabInfo.visible
            }
            : tabArray;
        })
      };

    case actionType.UPDATE_WITH_NEW_MEMBER_INFO:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          isFieldUpdated: action.payload.isFieldUpdated,
          profile: {
            ...state.memberInfo.profile,
            email: action.payload.email,
            phone: action.payload.phone,
            paperless: action.payload.paperless,
            communicationPreference: {
              ...state.memberInfo.profile.communicationPreference,
              email: action.payload.preferenceEmail,
              sms: action.payload.preferenceSms
            }
          }
        }
      };

    case actionType.NEW_FIELD_UPDATE_ERROR:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          respMsg: action.payload.respMsg
        }
      };

    case actionType.NEW_FIELD_UPDATE_SUCCESS:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          respMsg: action.payload.respMsg
        }
      };

    case actionType.NEW_UPDATE_EMAIL_ADDRESS:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: {
            ...state.memberInfo.profile,
            email: action.payload.email
          }
        }
      };

    case actionType.NEW_UPDATE_PHONE_NUMBER:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: {
            ...state.memberInfo.profile,
            phone: action.payload.phoneNmr
          }
        }
      };

    case actionType.NEW_UPDATE_PAPERLESS_PREFERENCE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: {
            ...state.memberInfo.profile,
            paperless: action.payload.paperless
          }
        }
      };

    case actionType.NEW_UPDATE_EMAIL_PREFERENCE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: {
            ...state.memberInfo.profile,
            communicationPreference: {
              ...state.memberInfo.profile.communicationPreference,
              email: action.payload.emailPreferece
            }
          }
        }
      };

    case actionType.NEW_UPDATE_SMS_PREFERENCE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          profile: {
            ...state.memberInfo.profile,
            communicationPreference: {
              ...state.memberInfo.profile.communicationPreference,
              sms: action.payload.smsPreference
            }
          }
        }
      };


    case actionType.UPDATE_SUCCESS_MSG:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          updateSuccess: action.payload.updateSuccess
        }
      };


    case actionType.SET_DEPENDENT_TOGGLE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          isDependentType: action.payload
        }
      };

    case actionType.RESET_ACCOUNT:
      return {
        ...state,
        isResetSuccessMsg: action.payload.isResetSuccessMsg
      };

    case actionType.RESET_MEMBER_DETAILS_REDUCER:
      return defaultState;

    case actionType.GET_MEMBER_INFO_SUCCESS:
      return {
        ...state,
        ...action.payload,
        loading: false,
        callerInfo: { 
          ...state.callerInfo,
          ...action.payload.memberDetail
        }
      }

      
    case actionType.RESET_ACCOUNT_REQUEST:
      return {
        ...state,
        loading: true
      }

    case actionType.RESET_ACCOUNT_SUCCESS:
      return {
        ...state,
        loading: false
      }

    case actionType.RESET_ACCOUNT_FAILURE:
      return {
        ...state,
        loading: false
      }

    case actionType.UPDATE_MEMBER_INFO_SUCCESS:
      return {
        ...state,
        profile: {
          ...state.profile,
          communicationPreference: {
            ...state.profile.communicationPreference,
            ...action.payload
          }
        }
      }

    case actionType.GET_MEMBER_INFO_REQUEST:
      return {
        ...state,
        loading: true
      }

    case actionType.GET_MEMBER_INFO_FAILURE:
      return {
        ...state,
        loading: false
      }

    case actionType.UPDATE_MEMBER_INFO_FAILURE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          respMsg: action.payload
        }
      }

    case actionType.CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        memberInfo: {
          ...state.memberInfo,
          respMsg: ''
        }
      }

      case actionType.GET_PROFILE_DATA_SUCCESS:
      return {
        ...state,
          profile: {
            ...state.profile,
            email: action.payload.email,
            phone: action.payload.phone,
            userName: action.payload.userName
        }
      };

    case actionType.CLEAR_MEMBER_DATA:
      return defaultState

    // case actionType.CLEAR_MEMBER_SEARCH_RESULT:
    //   return defaultState

    default:
      return state;
  }
};

export default memberProfile;
