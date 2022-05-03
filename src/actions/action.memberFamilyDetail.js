import * as actionType from '../constants/constant.action';


export const getFamilyMemberRequest = reqObj => {
  return {
  type:actionType.GET_FAMILY_MEMBER_REQUEST,
  payload: reqObj
  }
}
