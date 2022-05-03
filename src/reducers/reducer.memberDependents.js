import * as actionType from '../constants/constant.action';

const defaultState = {
  loading: true,
  networkError: false
};

const memberDependents = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_MEMBER_DEPENDENTS:
      return {
        ...state,
        details: action.payload.familyMembers
      };

    case actionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading
      };

    case actionType.SET_NETWORK_ERROR_DEPENDENT_API:
      return {
        ...state,
        networkError: action.payload.networkError
      };

    case actionType.RESET_MEMBER_DEPENDENTS_REDUCER:
      return defaultState;

    case actionType.GET_DEPENDENT_LIST_SUCCESS:
      return {
        ...state,
        networkError: false,
        details:action.payload,
        loading:false
      }

    case actionType.GET_DEPENDENT_LIST_FAILURE:
      return {
        ...state,
        networkError: true,
        loading:false
      }

    case actionType.UPDATE_ACCESS_APPROVAL_REQUEST:
      return {
        ...state,
        loading:true
      }

    case actionType.UPDATE_ACCESS_APPROVAL_SUCCESS:
      return {
        ...state,
        loading:false
      }  

    case actionType.UPDATE_ACCESS_APPROVAL_FAILURE:
      return {
        ...state,
        ...action.payload
      }  
  

    case actionType.CLEAR_MEMBER_SEARCH_RESULT:
      return defaultState

    default:
      return state;
  }
};

export default memberDependents;
