import { all } from 'redux-saga/effects'
import memberSearchWatcherSaga from './saga.memberSearch';
import getResourcesWatcherSaga from './saga.getResources';
import getMemberInfoWatcherSaga, {resetAccountWatcherSaga, getProfileInfoWatcherSaga} from './saga.getMemberInfo';
import memberCareWatcherSaga, { searchPcpWatcherSaga, updateMemberStatusWatcherSaga, updatePcpWatcherSaga, updatePcpActivationWatcherSaga, syncFamilyCareListWatcherSaga } from './saga.memberCare';
import { getReferralsWatcherSaga, getSpecialtiesWatcherSaga } from './saga.getReferrals';
import { getMemberMessagesWatcherSaga, getMessageTabInfoWatcherSaga, getMemberCompleteMessagesWatcherSaga, replyMemberMessageWatcherSaga, updateMemberMessageWatcherSaga, newMessagesWatcherSaga } from './saga.getMemberMessages';
import updateMemberInfoWatcherSaga from './saga.updateMemberInfo';
import {getDependentsWatcherSaga, updateAccessApprovalWatcherSaga } from './saga.getDependentList';
import completeMessagesWatcherSaga, { updateMessageWatcherSaga, outboxMessagesWatcherSaga, getMessagesWatcherSaga, replyMessageWatcherSaga, downloadAttachemntSaga } from './saga.messageList';
import getAllTemplatesWatcherSaga, {findMasterPlansWatcherSaga, createMessageWatcherSaga, getMembersByFamilyIdWatcherSaga} from './saga.newMessage';
import getFamilyMemberWatcherSaga from './saga.memberFamilyDetail';
import updateMailingAddressWatcherSaga from './saga.updateMailingAddress';
import {submitReferralsWatcherSaga} from './saga.SubmitReferrals';
import {verifyEligibilityWatcherSaga, getProfileWatcherSaga, checkUsernameWatcherSaga, createUserWatcherSaga, getMembersDataWatcherSaga} from './saga.memberActivation';
import { getLocationWatcherSaga } from './saga.getProviderDetails';

export default function* rootSaga(){
    yield all([
        verifyEligibilityWatcherSaga(),
        getMembersDataWatcherSaga(),
        createUserWatcherSaga(),
        checkUsernameWatcherSaga(),
        memberSearchWatcherSaga(),
        getResourcesWatcherSaga(),
        getMemberInfoWatcherSaga(),
        memberCareWatcherSaga(),
        getReferralsWatcherSaga(),
        getMemberMessagesWatcherSaga(),
        getMessageTabInfoWatcherSaga(),
        updateMemberMessageWatcherSaga(),
        updateMemberInfoWatcherSaga(),
        getDependentsWatcherSaga(),
        updateAccessApprovalWatcherSaga(),
        getSpecialtiesWatcherSaga(),
        completeMessagesWatcherSaga(),
        outboxMessagesWatcherSaga(),
        getMessagesWatcherSaga(),
        getMemberCompleteMessagesWatcherSaga(),
        replyMemberMessageWatcherSaga(),
        getAllTemplatesWatcherSaga(),
        findMasterPlansWatcherSaga(),
        createMessageWatcherSaga(),
        getMembersByFamilyIdWatcherSaga(),
        updateMessageWatcherSaga(),
        replyMessageWatcherSaga(),
        resetAccountWatcherSaga(),
        searchPcpWatcherSaga(),
        getFamilyMemberWatcherSaga(),
        updateMailingAddressWatcherSaga(),
        updateMemberStatusWatcherSaga(),
        submitReferralsWatcherSaga(),
        updatePcpWatcherSaga(),
        updatePcpActivationWatcherSaga(),
        newMessagesWatcherSaga(),
        getProfileInfoWatcherSaga(),
        getProfileWatcherSaga(),
        downloadAttachemntSaga(),
        syncFamilyCareListWatcherSaga(),
        getLocationWatcherSaga()
    ])
}