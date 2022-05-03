/**
 * Summary: Member Search actions
 * Description: Member Search function which will called to service layer
 * @author Prateek Jain
 * @date  09.10.2018
 */
import { baseService, token } from '../services';
import { authHeader } from '../helpers';
import { uriConstants } from '../constants/constant.uri';
import axios from 'axios';

function _accessToken() {
  let accessToken;
  sessionStorage
    .getItem('param')
    .split('&')
    .forEach(token => {
      if (token.indexOf('access_token') !== -1) {
        accessToken = token.split('=')[1];
      }
    });
  return accessToken;
}

function _requestQueryParam(requestData) {
  let reqParamList = [];
  for (let key in requestData) {
    if (requestData[key]) reqParamList.push(key + '=' + requestData[key]);
    else if (key == 'pcpFlag') reqParamList.push(key + '=' + requestData[key]);
  }
  const reqParam = reqParamList.join('&');
  return reqParam;
}

/**
 * Description: Fetch list of members on the basis of filter
 * @param {json} req_data
 * @return {json} req_response
 */

function updateMessages(requestData) {
  let url = uriConstants.UPDATE_MESSAGES;
  return baseService.put(url, _accessToken(), requestData);
}

function getMembers(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.MEMBER_SEARCH_URL + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

/**
 * Description: Fetch list of members on the basis of criteria selected
 * @param {json} req_data
 * @return {json} req_response
 */
function getMembersByCriteria(requestData) {
  let url = uriConstants.MEMBER_SEARCH_BY_CRITERIA_URL;
  return baseService.post(
    url,
    authHeader,
    token.setTokenInRequest(requestData)
  );
}

/**
 * Description: Fetch list of members on the basis of family ID
 * @param {json} req_data
 * @return {json} req_response
 */
function getMembersByFamilyId(requestData) {
  let url = uriConstants.MEMBER_SEARCH_BY_FAMILYID_URL;
  return baseService.post(
    url,
    authHeader,
    token.setTokenInRequest(requestData)
  );
}

/**
 * Summary: fetch profile info of a perticular member
 * Description: Fetch Profile info of the selected member
 * @param {json} req_data
 * @return {json} req_response
 */
function getMemberInfo(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.GET_MEMBER_INFO + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

/**
 * Summary: fetch All Family Members List
 * Description: Fetch other family member list of the selected member
 * @param {json} req_data
 * @return {json} req_response
 */
function getDependentList(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.DEPENDENT_LIST_URL + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function verifyEligibilty(requestData) {
  let url = uriConstants.VERIFY_ELIGIBILITY_URL;
  return baseService.post(url, null, requestData);
}

function checkUsername(requestData) {
  let url = uriConstants.CHECK_USERNAME_URL;
  return baseService.post(url, null, requestData);
}

function createUser(requestData) {
  let url = uriConstants.CREATE_USER_URL;
  return baseService.post(url, _accessToken(), requestData);
}

/**
 * Description: Fetch data of member activation on the basis of filter
 * @param {json} req_data
 * @return {json} req_response
 */
function getActivationInfo(requestData) {
  let url = uriConstants.GET_MEMBER_ACTIVATION_INFO;
  return baseService.post(
    url,
    authHeader,
    token.setTokenInRequest(requestData)
  );
}

/**
 * Description: Fetch data of member care on the basis of filter
 * @param {json} req_data
 * @return {json} req_response
 */
function getCareInfo(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.GET_MEMBER_CARE_INFO + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

/**
 * Description: Fetch message data of member on the basis of filter
 * @param {json} req_data
 * @return {json} req_response
 */
function getMessageInfo(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.GET_MEMBER_MESSAGE_URL + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

/**
 * Description: Fetch all message templates
 * @return {json} req_response
 */
function getAllTemplates() {
  let url = uriConstants.GET_ALL_MSG_TEMPLATES;
  return baseService.post(url, authHeader, token.setTokenInRequest({}));
}

/**
 * Description: Fetch all message templates
 * @return {json} req_response
 */

// function createMessageTemplate(requestData) {
//   let url = uriConstants.CREATE_MSG_TEMPLATE;
//   return baseService.post(url, authHeader, requestData);
// }

/**
 * Description: Fetch message data of member on the basis of filter
 * @param {json} req_data
 * @return {json} req_response
 */
function getAllMessageInfo() {
  let url = uriConstants.GET_ALL_MESSAGES;
  return baseService.post(url, authHeader, {});
}

/**
 * Description: Create email message
 * @param {json} requestData
 * @return {json} req_response
 */
function createMessage(requestData) {
  let url = uriConstants.CREATE_MSG;
  return baseService.post(url, authHeader, requestData);
}

function createInAppMessage(requestData) {
  let url = uriConstants.CREATE_IN_APP_MSG;
  return baseService.post(url, _accessToken(), requestData);
}

function createInAppMessageWithAttachment(requestData) {
  let url = uriConstants.CREATE_IN_APP_MSG_WITH_ATTACHMENT;
  return axios.post(url, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${_accessToken()}`,
    },
  });
}

/**
 * Description: set email unsubscription information
 * @param {json} requestData
 * @return {json} req_response
 */
function updateEmailNotificationPreferences(requestData) {
  let url = uriConstants.SET_EMAIL_UNSUBSCRIPTION_INFO;
  return baseService.post(url, authHeader, requestData);
}

/**
 * Description: function to get temporary login credentials for CSR to login into member portal
 * @param {json} requestData
 * @return {json} req_response
 */
function getTempMemberPortalLogin(requestData) {
  let url = uriConstants.GET_TEMP_MEMBER_PORTAL_LOGIN;
  return baseService.put(url, _accessToken(), requestData);
  // return baseService.post(url, authHeader, requestData);
}

/**
 * Description: delete temporary session created for CSR to login into member portal
 * @param {json} requestData
 * @return {json} req_response
 */
function deleteCsrMemberPortalsession(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.DELETE_CSR_MEMBER_PORTAL_SESSION + `?${reqParam}`;
  return baseService.delete(url, _accessToken());
  // return baseService.post(url, authHeader, requestData);
}

/**
 * Description: get inbox messages of a perticular member
 * @param {json} requestData
 * @return {json} req_response
 */
function getMemberInboxMessages(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.GET_MEMBER_INBOX_MESSAGE + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

/**
 * Description: get referral list of a perticular member
 * @param {json} requestData
 * @return {json} req_response
 */
function getReferrals(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.GET_REFERRALS + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function updateMemberUserData(requestData) {
  let url = uriConstants.UPDATE_MEMBER_DETAILS;
  return baseService.put(url, _accessToken(), requestData);
  // return baseService.post(
  //   url,
  //   authHeader,
  //   token.setTokenInRequest(requestData)
  // );
}

function searchPcp(requestData) {
  let reqParam = _requestQueryParam(requestData);
  let url = uriConstants.SEARCH_PCP + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function updatePcp(requestData) {
  let url = uriConstants.UPDATE_PCP;
  return baseService.put(url, _accessToken(), requestData);
}

function updateAddress(requestData) {
  let url = uriConstants.UPDATE_ADDRESS;
  return baseService.put(url, _accessToken(), requestData);

  // return baseService.post(
  //   url,
  //   authHeader,
  //   token.setTokenInRequest(requestData)
  // );
}

function accessApproval(requestData) {
  let url = uriConstants.ACCESS_APPROVAL;
  return baseService.put(url, _accessToken(), requestData);
}

function resetAccount(data) {
  let url = uriConstants.RESET_ACCOUNT;
  return baseService.put(url, _accessToken(), data);
  // return baseService.post(url, authHeader, token.setTokenInRequest(data));
}

function submitReferral(data) {
  let url = uriConstants.SUBMIT_REFERRAL;
  return baseService.post(url, _accessToken(), data);
}

function replyMessage(data) {
  let url = uriConstants.REPLY_MESSAGE_URL;
  return baseService.post(url, _accessToken(), data);
}

function replyMessageWithAttachment(requestData) {
  let url = uriConstants.REPLY_MESSAGE_WITH_ATTACHMENT;
  return axios.post(url, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${_accessToken()}`,
    },
  });
}

function retrieveReplyMessage(data) {
  let url = uriConstants.RETRIEVE_REPLY_MESSAGE_URL;
  return baseService.get(url, _accessToken());
  // let url = uriConstants.RETRIEVE_REPLY_MESSAGE_URL;
  // return baseService.post(url, authHeader, token.setTokenInRequest(data));
}

function getResourcesRequest(data) {
  let reqParam = _requestQueryParam(data);
  let url = uriConstants.GET_RESOURCES + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function getSpecialties(data) {
  let reqParam = _requestQueryParam(data);
  let url = uriConstants.GET_SPECIALTIES + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function findMasterPlans(data) {
  let url = uriConstants.FIND_MASTER_PLANS;
  return baseService.post(url, authHeader, token.setTokenInRequest(data));
}

function createMessageTemplate(requestData) {
  let url = uriConstants.CREATE_MSG;
  return baseService.post(url, _accessToken(), requestData);
}

function getMembersData(data) {
  let reqParam = _requestQueryParam(data);
  let url = uriConstants.GET_MEMBERS_DATA + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function getPreSignedUrl(data) {
  let reqParam = _requestQueryParam(data);
  let url = uriConstants.GET_PRESIGNED_URL + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

const putObjectInS3WithPreSignedUrl = async (url, file) => {
	return await axios.put(url, file, { headers: { 'content-disposition': 'inline', 'content-type': file.type } });
}

function syncFamilyClaimList(data) {
  let reqParam = _requestQueryParam(data);
  let url = uriConstants.GET_SYNC_FAMILY_CLAIM_LIST + `?${reqParam}`;
  return baseService.get(url, _accessToken());
}

function getGMAPKey(requestData) {
  let url = uriConstants.GET_GMAP_KEY;
  //console.log("getGMAPKey---", url, _accessToken());
  return baseService.get(
    url,
    _accessToken()
  );
}

/**
 * Description: const member list would be exposed so it can be accessed outside
 * @param {null}
 * @return {null}
 */
 export const serviceAPI = {
  getMembers,
  getMembersByCriteria,
  getDependentList,
  getMemberInfo,
  getActivationInfo,
  getCareInfo,
  getMessageInfo,
  getAllTemplates,
  createMessage,
  createInAppMessage,
  createInAppMessageWithAttachment,
  createMessageTemplate,
  getAllMessageInfo,
  getMembersByFamilyId,
  updateEmailNotificationPreferences,
  getTempMemberPortalLogin,
  deleteCsrMemberPortalsession,
  getMemberInboxMessages,
  getReferrals,
  updateMemberUserData,
  searchPcp,
  updateAddress,
  updatePcp,
  accessApproval,
  resetAccount,
  submitReferral,
  replyMessage,
  replyMessageWithAttachment,
  retrieveReplyMessage,
  getResourcesRequest,
  getSpecialties,
  updateMessages,
  findMasterPlans,
  verifyEligibilty,
  checkUsername,
  createUser,
  getMembersData,
  getPreSignedUrl,
  putObjectInS3WithPreSignedUrl,
  syncFamilyClaimList,
  getGMAPKey
};
