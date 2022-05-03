import * as actionType from '../constants/constant.action';

export const getLoginRequest = () => ({
  type: actionType.GET_LOGIN_REQUEST
});
  
export const getLoginSuccess = (data) => ({
  type: actionType.GET_LOGIN_SUCCESS,
  payload: {
      login: data,
    }
});

export const getLoginFailure = (err) => ({
  type: actionType.GET_LOGIN_FAILURE,
  payload:err
})

export const userLogoutRequest = () => ({
  type: actionType.USER_LOGOUT_REQUEST
})