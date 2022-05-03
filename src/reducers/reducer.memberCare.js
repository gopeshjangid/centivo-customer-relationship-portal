import * as actionType from "../constants/constant.action";

const defaultState = {
  careDetails: null,
  careError: "",
  memberId: null,
  pcpList: null,
  pcploading: false,
  openChangePcpModal: false,
  searchPcpListFailure: undefined,
  setPcpListFailure: undefined,
  searchPcpListZero: undefined,
  verifyEligibilityData: {},
  activationScreen: "contactInfo",
  syncFamilyClaimListLoading: false,
  syncFamilyClaimListError: false,
  syncFamilyClaimListSuccess: false,
};

const memberCare = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.UPDATE_MEMBER_STATUS_SUCCESS:
      return {
        ...state,
        ...action.payload,
      };
    case actionType.SET_SERVER_ERROR:
      return Object.assign({}, state, {
        careError: action.payload.careError,
      });

    case actionType.SET_CARE_DETAILS:
      return Object.assign({}, state, {
        careDetails: action.payload.careDetails,
      });

    case actionType.SET_DEFAULT_STATE_IN_REDUCER:
      return Object.assign({}, state.memberId === action.payload.memberId ? state : defaultState, {
        memberId: action.payload.memberId,
      });

    case actionType.SET_OPEN_CHANGE_PCP_MODAL:
      return {
        ...state,
        openChangePcpModal: action.payload.openChangePcpModal,
      };

    case actionType.SEARCH_PCP:
      return {
        ...state,
        pcpList: action.payload.pcpList,
      };

    case actionType.PCP_UPDATE_SUCCESS:
      return {
        ...state,
        updateError: "",
      };

    case actionType.SEARCH_PCP_LIST_ZERO:
      return Object.assign({}, state, {
        searchPcpListZero: action.payload.searchPcpListZero,
      });

    case actionType.SEARCH_PCP_LIST_FAILURE:
      return Object.assign({}, state, {
        searchPcpListFailure: action.payload.searchPcpListFailure,
      });

    case actionType.SET_PCP_LIST_FAILURE:
      return Object.assign({}, state, {
        setPcpListFailure: action.payload.setPcpListFailure,
      });

    case actionType.PCP_SET_LOADING:
      return {
        ...state,
        pcploading: action.payload.pcploading,
      };

    case actionType.UPDATE_PCP_DETAILS:
      return {
        ...state,
        careDetails: {
          ...state.careDetails,
          pcpDetail: {
            ...state.careDetails.pcpDetail,
            practiceSummary: {
              ...state.careDetails.pcpDetail.practiceSummary,
              phone: action.payload.phone,
              practiceName: action.payload.practiceName,
              practiceAddress: {
                ...state.careDetails.pcpDetail.practiceSummary.practiceAddress,
                city: action.payload.city,
                state: action.payload.state,
                street: action.payload.street,
                zip: action.payload.zip,
              },
            },
            providerSummary: {
              ...state.careDetails.pcpDetail.providerSummary,
              providerTitle: action.payload.providerTitle,
              providerFirstName: action.payload.providerFirstName,
              providerLastName: action.payload.providerLastName,
            },
          },
        },
      };

    case actionType.GET_MEMBER_CARE_INFO_FAILURE:
      return {
        ...state,
        careError: action.payload || true,
      };

    case actionType.GET_MEMBER_CARE_INFO_SUCCESS:
      return {
        ...state,
        careDetails: action.payload,
      };

    case actionType.SEARCH_PCP_SUCCESS:
      return {
        ...state,
        pcpList: action.payload,
      };

    case actionType.TOGGLE_ACTIVATION_SCREEN:
      return {
        ...state,
        activationScreen: action.payload,
      };

    case actionType.CLEAR_MEMBER_SEARCH_RESULT:
      return defaultState;

    case actionType.SELECT_PCP:
      let selectedPcpList = state.pcpList.map((pcpItem) => {
        if (pcpItem.npi == action.payload.npi && pcpItem.key == action.payload.key) {
          return {
            ...pcpItem,
            isSelected: true,
          };
        }
        return {
          ...pcpItem,
          isSelected: false,
        };
      });

      let addReferralEnabled = selectedPcpList.some((selectedPcpItem) => selectedPcpItem.isSelected == true);
      return {
        ...state,
        pcpList: selectedPcpList,
        addReferralEnabled,
      };

    case actionType.VERIFY_ELIGIBILITY_SUCCESS:
      return {
        ...state,
        verifyEligibilityData: action.payload,
      };

    case actionType.GET_MEMBERS_DATA_SUCCESS:
      return {
        ...state,
        allMembers: action.payload,
      };

    case actionType.VERIFY_ELIGIBILITY_FAILURE:
      return {
        ...state,
        activationError: action.payload,
      };

    case actionType.VERIFY_ELIGIBILITY_REQUEST:
      return {
        ...state,
        activationError: "",
      };
    case actionType.CHECK_USERNAME_REQUEST:
      return {
        ...state,
        activationError: "",
      };

    case actionType.CHECK_USERNAME_FAILURE:
      return {
        ...state,
        activationError: action.payload,
      };
    case actionType.CREATE_USER_REQUEST:
      return {
        ...state,
        activationError: "",
      };

    case actionType.CLEAR_ACTIVATION_ERROR:
      return {
        ...state,
        activationError: "",
      };

    case actionType.PCP_UPDATE_FAILURE:
      return {
        ...state,
        updateError: action.payload,
      };
    case actionType.SYNC_FAMILY_CLAIM_LIST_START:
      return {
        ...state,
        syncFamilyClaimListError: false,
        syncFamilyClaimListLoading: true,
        syncFamilyClaimListSuccess: false,
      };
    case actionType.SYNC_FAMILY_CLAIM_LIST_SUCCESS:
      return {
        ...state,
        syncFamilyClaimListError: false,
        syncFamilyClaimListLoading: false,
        syncFamilyClaimListSuccess: true,
      };
    case actionType.SYNC_FAMILY_CLAIM_LIST_FAILURE:
      return {
        ...state,
        syncFamilyClaimListLoading: false,
        syncFamilyClaimListError: true,
        syncFamilyClaimListSuccess: false,
      };
    case actionType.SYNC_FAMILY_CLAIM_LIST_RESET:
      return {
        ...state,
        syncFamilyClaimListLoading: false,
        syncFamilyClaimListError: false,
        syncFamilyClaimListSuccess: false,
      };
    default:
      return state;
  }
};

export default memberCare;
