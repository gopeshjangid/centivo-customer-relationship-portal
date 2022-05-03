/**
 * Summary: Message list action creator for global messages
 * Description: Message list action creator for global messages
 * @author Deepak Goyal
 * @date  26.10.2018
 */

import * as actionType from '../constants/constant.action';

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
  type: actionType.SET_MESSAGE_DETAILS,
  payload: {
    messageDetails: messageDetails
  }
});

export const setInboxMessageDetails = inboxMessageDetails => ({
  type: actionType.SET_INBOX_MESSAGE_DETAILS,
  payload: {
    inboxMessageDetails: inboxMessageDetails
  }
});

export const sendReplyMessageSuccess = message => ({
  type: actionType.REPLY_MESSAGE_LIST_SUCCESS,
  payload: {
    replyMessagesSuccess: message
  }
});

export const sendReplyMessageFailure = failure => ({
  type: actionType.REPLY_MESSAGE_LIST_FAILURE,
  payload: {
    replyMessagesFailure: failure
  }
});

export const retrieveReplyMessageSuccess = success => ({
  type: actionType.RETRIEVE_REPLY_MESSAGE_SUCCESS,
  payload: {
    retriveReplyMessageSuccess: success
  }
});

export const retrieveReplyMessageFailure = failure => ({
  type: actionType.RETRIEVE_REPLY_MESSAGE_FAILURE,
  payload: {
    retriveReplyMessageFailure: failure
  }
});

export const retrvSingleReplyMessageSuccess = success => ({
  type: actionType.RETRIEVE_SINGLE_REPLY_MESSAGE_SUCCESS,
  payload: {
    retrieveSingleReplyMessageSuccess: success
  }
});

export const retrvSingleReplyMessageFailure = failure => ({
  type: actionType.RETRIEVE_SINGLE_REPLY_MESSAGE_FAILURE,
  payload: {
    retrieveSingleReplyMessageFailure: failure
  }
});

export const getMemberCompleteMessages = reqParam => ({
  type:actionType.GET_COMPLETE_MESSAGES_REQUEST,
  payload:reqParam
})

export const getMemberOutboxMessages = reqParam => ({
  type:actionType.GET_OUTBOX_MESSAGES_REQUEST,
  payload:reqParam
})

export const getInboxMessages = reqParam => ({
  type:actionType.GET_MESSAGES_REQUEST,
  payload:reqParam
})

export const updateMessages = reqParam => ({
  type:actionType.UPDATE_MESSAGE_REQUEST,
  payload:reqParam
})

export const replyMessageList = reqParam => ({
  type:actionType.REPLY_MESSAGE_REQUEST,
  payload:reqParam
})

export const downloadAttachment = payload => ({
  type:actionType.DOWNLOAD_ATTACHMENT,
  payload
})