
export const API_DIRECTORY = { DOC_ROOT: '' };

export const urlConstants = {
  OLD_BASE_URL: process.env.REACT_APP_OLD_ENV_URL,
  BASE_URL: process.env.REACT_APP_ENV_URL,
  BASE_URL_ACTIVATION: process.env.REACT_APP_ENV_URL_ACTIVATION,
  FAKE_URL: 'http://localhost:3000'
};

export const API_INTERFACE = {
  LOGIN: '',
  // FIND_MEMBER: '/findMember',
  GET_MEMBER: '/getMember',
  FIND_MEMBER_BY_CRITERIA: '/getTargettedMemberByCriteria',
  // GET_MEMBER_PROFILE: '/selectMember',
  GET_MEMBER_PROFILE: '/getSelectMember',
  GET_DEPENDENT_LIST: '/getFamilyMembers',
  GET_MEMBER_ACTIVATION: '/getActivation',
  GET_MEMBER_CARE: '/getCare',
  // GET_MEMBER_MESSAGE: '/getMessages',
  GET_MEMBER_MESSAGE: '/getMessages',
  REPLY_MESSAGE: '/replyMessage',
  REPLY_MESSAGE_WITH_ATTACHMENT: '/replyMessageWithAttachment',
  GET_ALL_TEMPLATES: '/getTemplate',
  CREATE_TEMPLATE: '/templates',
  CREATE_MESSAGE: '/createMessages',
  // GET_ALL_MESSAGES: '/getMessages',
  MEMBER_SEARCH_BY_FAMILYID: '/findMember',
  UNSUBSCRIBE_LINK: '/unsubscribeUrl',
  GET_TEMP_MEMBER_PORTAL_LOGIN: '/updateMemberStatus',
  DELETE_CSR_MEMBER_PORTAL_SESSION: '/deleteUser',
  GET_MEMBER_INBOX_MESSAGE: '/getMemberMessages',
  GET_REFERRALS: '/getReferrals',
  UPDATE_MEMBER_DETAILS: '/updateMemberUserData',
  UPDATE_ADDRESS: '/updateAddress',
  // SEARCH_PCP: '/searchPcp',
  SEARCH_PCP: '/getPcps',
  UPDATE_PCP: '/updatePcp',
  ACCESS_APPROVAL: '/updateAccessApproval',
  RESET_ACCOUNT: '/resetAccount',
  SUBMIT_REFERRAL: '/submitReferral',
  // RETRIEVE_REPLY_MESSAGE: '/retrieveReplyMessage',
  RETRIEVE_REPLY_MESSAGE: '/getReplyMessages',
  GET_RESOURCES: '/getResources',
  GET_SPECIALTIES: '/getSpecialties',
  UPDATE_MESSAGES: '/updateMessages',
  FIND_MASTER_PLANS: '/findMasterPlans',
  CREATE_IN_APP_MESSAGE: '/createInAppMessage',
  VERIFY_ELIGIBILITY: '/verifyEligibility',
  CHECK_USERNAME: '/checkUserName',
  CREATE_USER: '/createUser',
  GET_MEMBERS_DATA: '/getMembersDataByEmployeeCertificateNumber',
  GET_PRESIGNED_URL: '/getPreSignedUrl',
  CREATE_IN_APP_MESSAGE_WITH_ATTACHMENT: '/createInAppMessageWithAttachment',
  SYNC_FAMILY_CLAIM_LIST: '/syncFamilyClaimList'
};

export const uriConstants = {
  VERIFY_ELIGIBILITY_URL:
    urlConstants.BASE_URL_ACTIVATION + API_INTERFACE.VERIFY_ELIGIBILITY,
  CHECK_USERNAME_URL:
    urlConstants.BASE_URL_ACTIVATION + API_INTERFACE.CHECK_USERNAME,
  CREATE_USER_URL: urlConstants.BASE_URL + API_INTERFACE.CREATE_USER,
  MEMBER_SEARCH_URL: urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER,
  GET_MEMBER_MESSAGE_URL:
    urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_MESSAGE,
  MEMBER_SEARCH_BY_CRITERIA_URL:
    urlConstants.BASE_URL + API_INTERFACE.FIND_MEMBER_BY_CRITERIA,
  MEMBER_SEARCH_BY_FAMILYID_URL:
    urlConstants.BASE_URL + API_INTERFACE.MEMBER_SEARCH_BY_FAMILYID,
  GET_MEMBER_INFO: urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_PROFILE,
  DEPENDENT_LIST_URL: urlConstants.BASE_URL + API_INTERFACE.GET_DEPENDENT_LIST,
  GET_MEMBER_ACTIVATION_INFO:
    urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_ACTIVATION,
  GET_MEMBER_CARE_INFO: urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_CARE,
  CREATE_MSG: urlConstants.BASE_URL + API_INTERFACE.CREATE_MESSAGE,
  // GET_ALL_MESSAGES: urlConstants.BASE_URL + API_INTERFACE.GET_ALL_MESSAGES,
  // GET_MEMBER_MESSAGE_INFO:
  //   urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_MESSAGE,
  SET_EMAIL_UNSUBSCRIPTION_INFO:
    urlConstants.BASE_URL + API_INTERFACE.UNSUBSCRIBE_LINK,
  GET_TEMP_MEMBER_PORTAL_LOGIN:
    urlConstants.BASE_URL + API_INTERFACE.GET_TEMP_MEMBER_PORTAL_LOGIN,
  DELETE_CSR_MEMBER_PORTAL_SESSION:
    urlConstants.BASE_URL + API_INTERFACE.DELETE_CSR_MEMBER_PORTAL_SESSION,
  GET_MEMBER_INBOX_MESSAGE:
    urlConstants.BASE_URL + API_INTERFACE.GET_MEMBER_INBOX_MESSAGE,
  GET_ALL_MSG_TEMPLATES:
    urlConstants.BASE_URL + API_INTERFACE.GET_ALL_TEMPLATES,
  GET_REFERRALS: urlConstants.BASE_URL + API_INTERFACE.GET_REFERRALS,
  UPDATE_MEMBER_DETAILS:
    urlConstants.BASE_URL + API_INTERFACE.UPDATE_MEMBER_DETAILS,
  UPDATE_ADDRESS: urlConstants.BASE_URL + API_INTERFACE.UPDATE_ADDRESS,
  SEARCH_PCP: urlConstants.BASE_URL + API_INTERFACE.SEARCH_PCP,
  UPDATE_PCP: urlConstants.BASE_URL + API_INTERFACE.UPDATE_PCP,
  ACCESS_APPROVAL: urlConstants.BASE_URL + API_INTERFACE.ACCESS_APPROVAL,
  RESET_ACCOUNT: urlConstants.BASE_URL + API_INTERFACE.RESET_ACCOUNT,
  SUBMIT_REFERRAL: urlConstants.BASE_URL + API_INTERFACE.SUBMIT_REFERRAL,
  REPLY_MESSAGE_URL: urlConstants.BASE_URL + API_INTERFACE.REPLY_MESSAGE,
  REPLY_MESSAGE_WITH_ATTACHMENT: urlConstants.BASE_URL + API_INTERFACE.REPLY_MESSAGE_WITH_ATTACHMENT,
  RETRIEVE_REPLY_MESSAGE_URL:
    urlConstants.BASE_URL + API_INTERFACE.RETRIEVE_REPLY_MESSAGE,
  GET_RESOURCES: urlConstants.BASE_URL + API_INTERFACE.GET_RESOURCES,
  GET_SPECIALTIES: urlConstants.BASE_URL + API_INTERFACE.GET_SPECIALTIES,
  UPDATE_MESSAGES: urlConstants.BASE_URL + API_INTERFACE.UPDATE_MESSAGES,
  FIND_MASTER_PLANS:
    urlConstants.OLD_BASE_URL + API_INTERFACE.FIND_MASTER_PLANS,
  CREATE_IN_APP_MSG:
    urlConstants.BASE_URL + API_INTERFACE.CREATE_IN_APP_MESSAGE,
  CREATE_IN_APP_MSG_WITH_ATTACHMENT:
    urlConstants.BASE_URL + API_INTERFACE.CREATE_IN_APP_MESSAGE_WITH_ATTACHMENT,
  GET_MEMBERS_DATA: urlConstants.BASE_URL + API_INTERFACE.GET_MEMBERS_DATA,
  GET_PRESIGNED_URL: urlConstants.BASE_URL + API_INTERFACE.GET_PRESIGNED_URL,
  GET_SYNC_FAMILY_CLAIM_LIST: urlConstants.BASE_URL + API_INTERFACE.SYNC_FAMILY_CLAIM_LIST,
  GET_GMAP_KEY: 'https://csr-portal-api.centivo.dev/getGMapKey'
};

export const mockUriConstants = {
  // GET_MEMBER_INFO: 'http://localhost:3002/selectMember'
  GET_MEMBER_INFO: 'http://localhost:3002/getSelectMember'
};