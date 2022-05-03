/**
 * Summary:Global Message Action Reducers
 * Description: Global Message Action Reducers
 * @author Deepak Goyal
 * @date  26.10.2018
 */

import * as actionType from '../constants/constant.action';

const defaultState = {
  messageDetails: null,
  inboxMessageDetails: null,
  replyMessageSuccess: null,
  replyMessagesFailure: null,
  completeMessageDetails: null,
  messageError: '',
  marked: false,
};

const messageList = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SERVER_ERROR:
      return {
        ...state,
        messageError: action.payload.messageError
      };

    case actionType.SET_MESSAGE_DETAILS:
      return {
        ...state,
        messageDetails: action.payload.messageDetails
      };

    case actionType.SET_INBOX_MESSAGE_DETAILS:
      return {
        ...state,
        inboxMessageDetails: action.payload.inboxMessageDetails
      };

    // case actionType.REPLY_MESSAGE_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     replyMessageSuccess: action.payload.replyMessagesSuccess
    //   };

    case actionType.REPLY_MESSAGE_LIST_FAILURE:
      return {
        ...state,
        replyMessagesFailure: action.payload.replyMessagesFailure
      };

    case actionType.RETRIEVE_REPLY_MESSAGE_SUCCESS:
      return {
        ...state,
        retriveReplyMessageSuccess: action.payload.retriveReplyMessageSuccess
      };

    case actionType.RETRIEVE_REPLY_MESSAGE_FAILURE:
      return {
        ...state,
        retriveReplyMessageFailure: action.payload.retriveReplyMessageFailure
      };

    case actionType.RETRIEVE_SINGLE_REPLY_MESSAGE_SUCCESS:
      return {
        ...state,
        retrieveSingleReplyMessageSuccess:
          action.payload.retrieveSingleReplyMessageSuccess
      };

    case actionType.RETRIEVE_SINGLE_REPLY_MESSAGE_FAILURE:
      return {
        ...state,
        retrieveSingleReplyMessageFailure:
          action.payload.retrieveSingleReplyMessageFailure
      };

    case actionType.GET_MESSAGES_SUCCESS:
      return {
        ...state,
        inboxMessageDetails: action.payload,
        marked: false,
        replyMessageSuccess:false
      }

    case actionType.GET_COMPLETE_MESSAGES_SUCCESS:
      return {
        ...state,
        completeMessageDetails: action.payload,
        marked: false
      }

    case actionType.GET_COMPLETE_MESSAGES_FAILURE:
      return {
        ...state,
        marked: false
      }

    case actionType.GET_OUTBOX_MESSAGES_SUCCESS:
      return {
        ...state,
        retriveReplyMessageSuccess: action.payload
      }

    case actionType.UPDATE_MESSAGE_REQUEST:
      return {
        ...state,
        marked: true
      }

    case actionType.REPLY_MESSAGE_SUCCESS:
      return {
        ...state,
        replyMessageSuccess:true
      }

    case actionType.REPLY_MESSAGE_FAILURE:
      return{
        ...state,
        replyMessageFailure:true
      }

    // case actionType.UPDATE_MESSAGE_SUCCESS:
    //   return {
    //     ...state,  
    //   }

    default:
      return state;
  }
};

export default messageList;
