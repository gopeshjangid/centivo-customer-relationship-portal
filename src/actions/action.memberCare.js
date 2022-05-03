import * as actionType from "../constants/constant.action";

export const getCareTabInfo = (reqObj) => ({
  type: actionType.GET_MEMBER_CARE_INFO_REQUEST,
  payload: {
    ...reqObj,
    memberUuid: window.atob(reqObj.memberUuid),
  },
});

export const getMemberStatus = (reqObj) => ({
  type: actionType.UPDATE_MEMBER_STATUS_REQUEST,
  payload: reqObj,
});

export const searchPcp = (reqObj) => ({
  type: actionType.SEARCH_PCP_REQUEST,
  payload: reqObj,
});

export const selectPcpItem = (reqObj) => ({
  type: actionType.SELECT_PCP,
  payload: reqObj,
});

/**
 * Summary: get members by search
 * Description: load grid by members search
 */
export const setPcpUpdate = (requestJSON) => ({
  type: actionType.PCP_UPDATE_REQUEST,
  payload: requestJSON,
});

export const setPcpUpdateActivation = (requestJSON) => ({
  type: actionType.PCP_UPDATE_ACTIVATION_REQUEST,
  payload: requestJSON,
});

/**
 * Summary: set server errors
 * Description: set server errors on search page
 * @param {string} errorMessage
 */
export const setError = (careError) => ({
  type: actionType.SET_SERVER_ERROR,
  payload: {
    careError: careError,
  },
});

/**
 * Summary: set details of the searched members
 * Description: set details of the searched members in table if members > 1
 * @param {Array} careDetails
 */
export const setCareDetails = (careDetails) => ({
  type: actionType.SET_CARE_DETAILS,
  payload: {
    careDetails: careDetails,
  },
});

/**
 * Summary: reset member details reducer to initial state on tab click
 * Description: reset member details reducer to initial state on tab click
 */
export const setDefaultStateInReducer = (memberId) => ({
  type: actionType.SET_DEFAULT_STATE_IN_REDUCER,
  payload: {
    memberId: memberId,
  },
});

/**
 * Summary: set details of the searched members
 * Description: set details of the searched members in table if members > 1
 * @param {Array} PCPlist
 */
export const setPcpDetail = (pcpList) => ({
  type: actionType.SEARCH_PCP,
  payload: {
    pcpList: pcpList,
  },
});

/**
 * Summary: set loading boolean
 * Description: set loading boolean
 * @param {boolean} pcpModalBoolean
 */
export const setOpenChangePcpModal = (openChangePcpModal) => ({
  type: actionType.SET_OPEN_CHANGE_PCP_MODAL,
  payload: {
    openChangePcpModal: openChangePcpModal,
  },
});

/**
 * Summary: set loading boolean
 * Description: set loading boolean
 * @param {boolean} loadingBoolean
 */
export const setPcpLoading = (pcploading) => ({
  type: actionType.PCP_SET_LOADING,
  payload: {
    pcploading: pcploading,
  },
});

export const searchPcpListZero = (searchPcpListZero) => ({
  type: actionType.SEARCH_PCP_LIST_ZERO,
  payload: {
    searchPcpListZero: searchPcpListZero,
  },
});

export const searchPcpListFailure = (searchPcpListFailure) => ({
  type: actionType.SEARCH_PCP_LIST_FAILURE,
  payload: {
    searchPcpListFailure: searchPcpListFailure,
  },
});

export const setPcpListFailure = (setPcpListFailure) => ({
  type: actionType.SET_PCP_LIST_FAILURE,
  payload: {
    setPcpListFailure: setPcpListFailure,
  },
});

export const updatePCPDetails = (phone, practiceName, city, state, street, zip, providerTitle, providerFirstName, providerLastName) => ({
  type: actionType.UPDATE_PCP_DETAILS,
  payload: {
    phone,
    practiceName,
    city,
    state,
    street,
    zip,
    providerTitle,
    providerFirstName,
    providerLastName,
  },
});

export const syncFamilyClaimListStart = (payload) => ({ type: actionType.SYNC_FAMILY_CLAIM_LIST_START, payload });
export const syncFamilyClaimListReset = () => ({ type: actionType.SYNC_FAMILY_CLAIM_LIST_RESET });

