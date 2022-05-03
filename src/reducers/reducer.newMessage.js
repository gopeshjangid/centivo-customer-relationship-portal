import * as actionType from '../constants/constant.action';

const defaultState = {
  selectedMembersCount: 0,
  templates: null,
  newMessageError: '',
  newMessageSuccess: '',
  criteriaError: '',
  templateListLoaded: false,
  planList: [],
  sendingEmails:false
};

const newMessage = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SERVER_SUCCESS:
      return Object.assign({}, state, {
        newMessageSuccess: action.payload.newMessageSuccess
      });

    case actionType.SET_SERVER_ERROR:
      return Object.assign({}, state, {
        newMessageError: action.payload.newMessageError
      });

    case actionType.SET_TEMPLATE_LIST:
      return Object.assign({}, state, {
        templateList: action.payload.templateList,
        templateListLoaded: action.payload.templateListLoaded
      });

    case actionType.SET_TEMPLATES_NAME:
      return Object.assign({}, state, {
        templates: action.payload.templates
      });

    case actionType.SET_CLEAR_FORM:
      return Object.assign({}, defaultState, {});

    case actionType.SET_SELECTED_MEMBERS_COUNT:
      return Object.assign({}, state, {
        selectedMembersCount: action.payload.selectedMembersCount
      });

    case actionType.GET_ALL_TEMPLATES_SUCCESS:
      let templateList = action.payload.templates.sort(function (a, b) {
        if (a.templateName < b.templateName) {
          return -1;
        }
        if (a.templateName > b.templateName) {
          return 1;
        }
        return 0;
      });
      return {
        ...state,
        templateList,
        templateListLoaded: true
      }

      case actionType.GET_ALL_TEMPLATES_FAILURE:
        return {
          ...state,
          templateListLoaded: true
        }

    case actionType.FIND_MASTER_PLANS_SUCCESS:
      return {
        ...state,
        planList: action.payload.plans
      }

    case actionType.CREATE_MESSAGE_REQUEST:
      return {
        ...state,
        sendingEmails: true
      }

    case actionType.CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        newMessageSuccess: action.payload,
        sendingEmails:false
      }

    case actionType.CREATE_MESSAGE_FAILURE:
      return {
        ...state,
        newMessageError:action.payload,
        sendingEmails: false
      }

    case actionType.RESET_CONFIRMATION_MODAL:
      return {
        ...state,
        newMessageSuccess: '',
        newMessageError: ''
      }

    case actionType.GET_MEMBERS_BY_FAMILY_ID_REQUEST:
      return {
        ...state,
        memberSearchLoading: true
      }

    case actionType.GET_MEMBERS_BY_FAMILY_ID_SUCCESS:
      return {
        ...state,
        members: action.payload,
        memberSearchLoading: false,
        findMemberResultError:action.payload.length == 0 ? 'Members not found for given search criteria' : false
      }

    default:
      return state;
  }
};

export default newMessage;
