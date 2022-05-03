/**
 * Summary: Member Message Tab Action Creators
 * Description: Member Message Tab Action Creators
 * @author Deepak Goyal
 * @date  10.10.2018
 */

import * as actionType from '../constants/constant.action';
// import { serviceAPI } from './../services/service.api';

/**
 * Summary: get Message tab info
 * Description: load grid by members search
 */

export const getMessageTabInfo = reqParam => ({
  type:actionType.GET_MESSAGE_TAB_INFO_REQUEST,
  payload:reqParam
})

export const replyMemberMessage = reqParam => ({
  type:actionType.REPLY_MEMBER_MESSAGE_REQUEST,
  payload:reqParam
})


/**
 * Summary: get Message tab info
 * Description: load grid by members search
 */
export const getMemberInboxMessages = reqParam => ({
  type:actionType.GET_MEMBER_INBOX_MESSAGES_REQUEST,
  payload:reqParam
})

export const getMemberCompleteMessagesInfo = reqParam => ({
  type:actionType.GET_MEMBER_COMPLETE_MESSAGES_REQUEST,
  payload:reqParam
})

export const updateMemberMessages = reqParam => ({
  type:actionType.UPDATE_MEMBER_MESSAGE_REQUEST,
  payload:reqParam
})

/**
 * Summary: set server errors
 * Description: set server errors on search page
 * @param {boolean} loadingBoolean
 */
export const setError = messageError => ({
  type: actionType.SET_SERVER_ERROR,
  payload: {
    messageError: messageError
  }
});

/**
 * Summary: set message array
 * Description: set message array
 * @param {Array} messageDetails
 */
export const setMessageDetails = messageDetails => ({
  type: actionType.SET_MEMBER_MESSAGE_DETAILS,
  payload: {
    messageDetails: messageDetails
  }
});

export const setInboxMessageDetails = inboxMessageDetails => ({
  type: actionType.SET_MEMBER_INBOX_MESSAGE_DETAILS,
  payload: {
    inboxMessageDetails: inboxMessageDetails
  }
});

export const createNewMessage = reqObj => ({
  type: actionType.NEW_MESSAGE_REQUEST,
  payload: reqObj
})