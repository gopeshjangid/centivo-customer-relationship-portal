import * as actionType from '../constants/constant.action';

const defaultState = {
  messageDetails: null,
  inboxMessageDetails: null,
  messageError: '',
  memberId: null,
  completeMessageDetails: null
};

const memberMessage = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SERVER_ERROR:
      return Object.assign({}, state, {
        messageError: action.payload.messageError
      });

    case actionType.SET_MEMBER_MESSAGE_DETAILS:
      return Object.assign({}, state, {
        messageDetails: action.payload.messageDetails
      });

    case actionType.SET_MEMBER_INBOX_MESSAGE_DETAILS:
      return Object.assign({}, state, {
        inboxMessageDetails: action.payload.inboxMessageDetails
      });

    case actionType.GET_MEMBER_INBOX_MESSAGES_SUCCESS:
      return {
        ...state,
        inboxMessageDetails: action.payload.messages,
        replyMessageSuccess: false
      }

      case actionType.REPLY_MEMBER_MESSAGE_SUCCESS:
      return {
        ...state,
        replyMessageSuccess: action.payload
      }

      case actionType.REPLY_MEMBER_MESSAGE_FAILURE:
      return {
        ...state,
        replyMessageSuccess: action.payload
      }

    case actionType.GET_MEMBER_COMPLETE_MESSAGES_SUCCESS:
      return {
        ...state,
        completeMessageDetails: action.payload.messages
      }

    case actionType.GET_MESSAGE_TAB_INFO_SUCCESS:
      return {
        ...state,
        messageDetails: action.payload
      }

    case actionType.GET_MESSAGE_TAB_INFO_FAILURE:
      return {
        ...state,
        messageDetails: {
          messages: []
        }
      }

    case actionType.UPDATE_MEMBER_MESSAGE_SUCCESS:
      return {
        ...state,
        marked: false
      };
    case actionType.UPDATE_MEMBER_MESSAGE_FAILURE:
      return {
        ...state,
        marked: false
      };

    case actionType.CLEAR_MEMBER_SEARCH_RESULT:
      return defaultState

    default:
      return state;
  }
};

export default memberMessage;
