import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import memberProfile from './reducer.memberProfile';
import memberDependents from './reducer.memberDependents';
import memberSearch from './reducer.memberSearch';
import memberCare from './reducer.memberCare';
import memberActivation from './reducer.memberActivation';
import memberMessage from './reducer.memberMessage';
import newMessage from './reducer.newMessage';
import createTemplate from './reducer.createTemplate';
import criteriaSearch from './reducer.criteriaSearch';
import messageList from './reducer.messageList';
import referralDetails from './reducer.referral';
import resourceReducer from './reducer.getResources';
import loginReducer from './reducer.login';
import memberFamilyProfile from './reducer.memberFamilyDetail';
import updateAddressReducer from './reducer.updateMailingAddress';
import providerDirectory from './reducer.providerDirectory';

const app = combineReducers({
  memberProfile,
  memberDependents,
  memberSearch,
  memberCare,
  memberActivation,
  memberMessage,
  newMessage,
  createTemplate,
  criteriaSearch,
  messageList,
  referralDetails,
  memberFamilyProfile,
  resources: resourceReducer,
  form: reduxFormReducer,
  login: loginReducer,
  updateMailingAddress: updateAddressReducer,
  providerDirectory  
});

export default app;
