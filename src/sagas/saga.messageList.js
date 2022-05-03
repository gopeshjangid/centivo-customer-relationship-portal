import { call, put, takeLatest } from 'redux-saga/effects'
import { GET_COMPLETE_MESSAGES_REQUEST, GET_COMPLETE_MESSAGES_SUCCESS, GET_COMPLETE_MESSAGES_FAILURE, GET_OUTBOX_MESSAGES_REQUEST, GET_OUTBOX_MESSAGES_SUCCESS, GET_OUTBOX_MESSAGES_FAILURE, GET_MESSAGES_SUCCESS, GET_MESSAGES_REQUEST, GET_MESSAGES_FAILURE, UPDATE_MESSAGE_REQUEST, UPDATE_MESSAGE_SUCCESS, UPDATE_MESSAGE_FAILURE, REPLY_MESSAGE_FAILURE, REPLY_MESSAGE_SUCCESS, REPLY_MESSAGE_REQUEST, REPLY_MEMBER_MESSAGE_REQUEST, DOWNLOAD_ATTACHMENT } from "../constants"
import { api } from '../services'
import uuid from "uuid/v4";

function* replyMessageResult(action) {
    try {
        //TODO reply with attachments
        let message = action.payload;
        let attachments = [];
        if (message.files) {
            for (let i = 0; i < message.files.length; i++) {
             // console.log(message.files[i].name);
              let params = {
                Key: `csr-in-app-messages/attachments/${message.memberUuid}/${uuid()}/${message.files[i].name}`,
                operation: "putObject",
              };
              const getUploadUrlresponse = yield call(api.getPreSignedUrl, params);
              let s3UploadUrl = getUploadUrlresponse.data.url;
              const s3UploadResponse = yield call(api.putObjectInS3WithPreSignedUrl, s3UploadUrl, message.files[i]);
              if (s3UploadResponse.status === 200) {
                attachments.push({
                  Key: params.Key,
                  name: message.files[i].name,
                  size: message.files[i].size,
                  type: message.files[i].type,
                });
              }
            }
            //remove the binary files and keep the metadata
            delete message.files;
          }
      
          message.attachments = attachments;

        const result = yield call(api.replyMessage, message)
        if (result.status === 200) {
            yield put({ type: REPLY_MESSAGE_SUCCESS, payload: true}) 
            yield put({type: GET_MESSAGES_REQUEST, payload:{messageFolder: 'inbox'}})       
        }
        else {
            yield put({ type: REPLY_MESSAGE_FAILURE, payload: result.response.data })
        }
    }
    catch (error) {
        yield put({ type: REPLY_MESSAGE_FAILURE, error })
    }
}

export function* replyMessageWatcherSaga() {
    yield takeLatest(REPLY_MESSAGE_REQUEST, replyMessageResult)
}


function* updateMessageResult(action) {
    try {
        const result = yield call(api.updateMessages, action.payload)
        if (result.data && result.status === 200) {
            yield put({ type: UPDATE_MESSAGE_SUCCESS, payload: result.data })
            if(action.payload.completed){
                yield getMessagesResult({
                    payload: {
                        messageFolder:"inbox"
                    }
                })
            }
            else{
                yield completeMessagesResult({
                    payload: {
                        messageFolder:"complete"
                    }
                })
            }
            
        }
        else {
            yield put({ type: UPDATE_MESSAGE_FAILURE, payload: result.response.data })
        }
    }
    catch (error) {
        yield put({ type: UPDATE_MESSAGE_FAILURE, error })
    }
}

export function* updateMessageWatcherSaga() {
    yield takeLatest(UPDATE_MESSAGE_REQUEST, updateMessageResult)
}

function* getMessagesResult(action) {

    try {
        const result = yield call(api.getMemberInboxMessages, action.payload)
        if (result.data && result.status === 200) {
            yield put({ type: GET_MESSAGES_SUCCESS, payload: result.data })
        }
        else {
            yield put({ type: GET_MESSAGES_FAILURE, payload: result.response.data.resultDescription })
        }
    }
    catch (error) {
        yield put({ type: GET_MESSAGES_FAILURE, error })
    }
}

export function* getMessagesWatcherSaga() {
    yield takeLatest(GET_MESSAGES_REQUEST, getMessagesResult)
}

function* outboxMessagesResult(action) {
    try {
        const result = yield call(api.retrieveReplyMessage)
        if (result && result.data) {
            yield put({ type: GET_OUTBOX_MESSAGES_SUCCESS, payload: result.data })
        }
        else {
            yield put({ type: GET_OUTBOX_MESSAGES_FAILURE, payload: result.data.resultDescription })
        }

    }
    catch (error) {
        yield put({ type: GET_OUTBOX_MESSAGES_FAILURE, error })
    }
}


export function* outboxMessagesWatcherSaga() {
    yield takeLatest(GET_OUTBOX_MESSAGES_REQUEST, outboxMessagesResult)
}

function* completeMessagesResult(action) {
    try {
        const result = yield call(api.getMemberInboxMessages, action.payload)
        if (result.data ) {
            yield put({ type: GET_COMPLETE_MESSAGES_SUCCESS, payload: result.data })
        }
        else {
            yield put({ type: GET_COMPLETE_MESSAGES_FAILURE, payload: result.data.resultDescription })
        }

    }
    catch (error) {
        yield put({ type: GET_COMPLETE_MESSAGES_FAILURE, error })
    }
}


export default function* completeMessagesWatcherSaga() {
    yield takeLatest(GET_COMPLETE_MESSAGES_REQUEST, completeMessagesResult)
}

function* downloadAttachemnt({type, payload: {Key, filename}})  {

    try {
        //encodeURIComponent(`inline; filename="${filename}"`)
        const result = yield call(api.getPreSignedUrl, {Key, operation: 'getObject', responseContentDisposition: encodeURIComponent(`inline; filename="${filename}"`)});
		const otherWindow = window.open();
		otherWindow.opener = null;
		otherWindow.location = result.data.url;
        // var downloadUrl = result.data.url + (result.data.url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // Adds the parameter for a forced download
        // window.open(downloadUrl);
	} catch (error) {
        yield put({ type: GET_COMPLETE_MESSAGES_FAILURE, error })
	}
}

export function* downloadAttachemntSaga() {
    yield takeLatest(DOWNLOAD_ATTACHMENT, downloadAttachemnt)
}