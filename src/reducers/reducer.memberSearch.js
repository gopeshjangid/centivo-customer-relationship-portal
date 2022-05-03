import * as actionType from '../constants/constant.action';

const defaultState = {
  loading: false,
  members: [],
  searchError: '',
  familyID: '',
  
};

const memberSearch = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.FIND_MEMBER_REQUESTED:
      return {
        ...state,
        loading:true
      }
    case actionType.FIND_MEMBER_SUCCESS:
      if(action.payload.length === 0 ){
        return {
          ...state,
          members: action.payload,
          loading:false,
          searchError:'Members not found for given search criteria'
        }
      }

      return {
        ...state,
        members: action.payload,
        loading:false
      }
    case actionType.CLEAR_MEMBER_SEARCH_RESULT:
      return {
        loading:false,
        members:[]
      }
    case actionType.FIND_MEMBER_FAILURE:
      return{
        ...state,
        searchError:action.payload,
        loading:false
      }
 
      // case actionType.SET_SERVER_ERROR:
      // return Object.assign({}, state, {
      //   searchError: action.payload.searchError
      // });

    // case actionType.SET_CLEAR_FORM:
    //   return Object.assign({}, defaultState, {});

    // case actionType.SET_SERCHED_MEMBERS_LIST:
    //   return Object.assign({}, state, {
    //     members: action.payload.members
    //   });

    case actionType.SET_FAMILY_ID:
      return {
        ...state,
        familyID: action.payload
      }

    case actionType.CLEAR_MEMBER_SEARCH:
      return defaultState

    default:
      return state;
  }
};

export default memberSearch;
