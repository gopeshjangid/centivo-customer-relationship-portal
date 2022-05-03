
import * as actionType from '../constants/constant.action';
// import { serviceAPI } from '../services/service.api';
import { history } from '../helpers';

export const getAllTemplates = () => ({
  type:actionType.GET_ALL_TEMPLATES_REQUEST
})

export const findMasterPlansRequest = () => ({
  type:actionType.FIND_MASTER_PLANS_REQUEST
})

export const createMessage = reqObj => ({
  type:actionType.CREATE_MESSAGE_REQUEST,
  payload:reqObj
})

export const resetConfirmationModal = () => ({
  type:actionType.RESET_CONFIRMATION_MODAL
})

export const getMembersByFamilyId = (reqObj) => ({
  type:actionType.GET_MEMBERS_BY_FAMILY_ID_REQUEST,
  payload:reqObj
})