import * as actionType from '../constants/constant.action';

const defaultState = {
    fetching: false,
    userLoggedIn: false
};

const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    
    case actionType.GET_LOGIN_REQUEST:
      return {
        ...state,
        userLoggedIn:false,
        fetching: true,
        errMsg:''
      };

    case actionType.GET_LOGIN_SUCCESS:
      return {
        ...state,
        fetching: false,
        userLoggedIn:true,
        login: action.payload
      };

    case actionType.GET_LOGIN_FAILURE:
      return {
        ...state,
        fetching:false,
        userLoggedIn:false,
        errMsg:action.payload.message
      }

    case actionType.USER_LOGOUT_REQUEST:
      return{
        ...state,
        userLoggedIn:false,
      }
      
    default:
      return state;
  }
};

export default loginReducer;
