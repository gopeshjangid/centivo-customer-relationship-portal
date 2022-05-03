import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_MEMBER_INBOX_MESSAGES_REQUEST,
  GET_MEMBER_INBOX_MESSAGES_SUCCESS,
  GET_MEMBER_INBOX_MESSAGES_FAILURE,
  GET_MESSAGE_TAB_INFO_REQUEST,
  GET_MESSAGE_TAB_INFO_SUCCESS,
  GET_MESSAGE_TAB_INFO_FAILURE,
  GET_MEMBER_COMPLETE_MESSAGES_SUCCESS,
  GET_MEMBER_COMPLETE_MESSAGES_REQUEST,
  GET_MEMBER_COMPLETE_MESSAGES_FAILURE,
  REPLY_MEMBER_MESSAGE_REQUEST,
  REPLY_MEMBER_MESSAGE_SUCCESS,
  REPLY_MEMBER_MESSAGE_FAILURE,
  NEW_MESSAGE_REQUEST,
  NEW_MESSAGE_SUCCESS,
  NEW_MESSAGE_FAILURE,
  UPDATE_MEMBER_MESSAGE_REQUEST,
  UPDATE_MEMBER_MESSAGE_SUCCESS,
  UPDATE_MEMBER_MESSAGE_FAILURE,
} from "../constants";

import { api } from "../services";
import uuid from "uuid/v4";

function* replyMemberMessageResult(action) {
  // console.log(action.payload);
  try {
    let message = action.payload;
    let attachments = [];
    // let formData = new FormData();
    // if (message.files) {
    //   for (let key in message) {
    //     if (key === "files") {
    //       for (let i = 0; i < message.files.length; i++) {
    //         formData.append(`attachment${i + 1}`, message.files[i]);
    //       }
    //     } else {
    //       formData.append(key, message[key]);
    //     }
    //   }
    // }

    // const result = yield call(api.replyMessageWithAttachment, formData);
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
      const result = yield call(api.replyMessage, message);
    if (result.status === 200) {
      yield put({ type: REPLY_MEMBER_MESSAGE_SUCCESS, payload: true });
      yield put({ type: GET_MEMBER_INBOX_MESSAGES_REQUEST, payload: { messageFolder: "inbox", memberUuid: action.payload.memberUuid } });
    } else {
      yield put({ type: REPLY_MEMBER_MESSAGE_FAILURE, payload: false });
    }
  } catch (error) {
    yield put({ type: REPLY_MEMBER_MESSAGE_FAILURE, error });
  }
}

function* replyMemberMessageWatcherSaga() {
  yield takeLatest(REPLY_MEMBER_MESSAGE_REQUEST, replyMemberMessageResult);
}

function* getMemberMessagesResult(action) {
  try {
    const result = yield call(api.getMemberInboxMessages, action.payload);
    if (result.data && result.status === 200) {
      yield put({ type: GET_MEMBER_INBOX_MESSAGES_SUCCESS, payload: result.data });
    } else {
      yield put({ type: GET_MEMBER_INBOX_MESSAGES_FAILURE, payload: result.response.data.resultDescription });
    }
  } catch (error) {
    yield put({ type: GET_MEMBER_INBOX_MESSAGES_FAILURE, error });
  }
}

function* getMemberMessagesWatcherSaga() {
  yield takeLatest(GET_MEMBER_INBOX_MESSAGES_REQUEST, getMemberMessagesResult);
}

function* getMessageTabInfoResult(action) {
  try {
    const result = yield call(api.getMessageInfo, action.payload);
    if (result.data && result.status === 200) {
      yield put({ type: GET_MESSAGE_TAB_INFO_SUCCESS, payload: result.data });
    } else {
      yield put({ type: GET_MESSAGE_TAB_INFO_FAILURE, payload: result.response.data.resultDescription });
    }
  } catch (error) {
    yield put({ type: GET_MESSAGE_TAB_INFO_FAILURE, error });
  }
}

function* getMessageTabInfoWatcherSaga() {
  yield takeLatest(GET_MESSAGE_TAB_INFO_REQUEST, getMessageTabInfoResult);
}

function* getMemberCompleteMessagesResult(action) {
  try {
    const result = yield call(api.getMemberInboxMessages, action.payload);
    if (result.data && result.status === 200) {
      yield put({ type: GET_MEMBER_COMPLETE_MESSAGES_SUCCESS, payload: result.data });
    } else {
      yield put({ type: GET_MEMBER_COMPLETE_MESSAGES_FAILURE, payload: result.response.data.resultDescription });
    }
  } catch (error) {
    yield put({ type: GET_MEMBER_COMPLETE_MESSAGES_FAILURE, error });
  }
}

function* getMemberCompleteMessagesWatcherSaga() {
  yield takeLatest(GET_MEMBER_COMPLETE_MESSAGES_REQUEST, getMemberCompleteMessagesResult);
}

function* newMessageResult(action) {
 // console.log(action.payload);
  try {
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
    const result = yield call(api.createInAppMessage, message);
    if (result.status === 200) {
      yield put({ type: NEW_MESSAGE_SUCCESS, payload: result.data });
    } else {
      yield put({ type: NEW_MESSAGE_FAILURE, payload: result.response.data.error.message });
    }
  } catch (error) {
    yield put({ type: NEW_MESSAGE_FAILURE, error });
  }
}

function* newMessagesWatcherSaga() {
  yield takeLatest(NEW_MESSAGE_REQUEST, newMessageResult);
}

function* updateMemberMessageResult(action) {
  try {
    const { memberUuid, ...restData } = action.payload;
    const result = yield call(api.updateMessages, restData);
    if (result.data && result.status === 200) {
      yield put({ type: UPDATE_MEMBER_MESSAGE_SUCCESS, payload: result.data });
      if (action.payload.completed) {
        yield getMemberMessagesResult({
          payload: {
            messageFolder: "inbox",
            memberUuid: memberUuid,
          },
        });
      } else {
        yield getMemberCompleteMessagesResult({
          payload: {
            messageFolder: "complete",
            memberUuid: memberUuid,
          },
        });
      }
    } else {
      yield put({ type: UPDATE_MEMBER_MESSAGE_FAILURE, payload: result.response.data });
    }
  } catch (error) {
    yield put({ type: UPDATE_MEMBER_MESSAGE_FAILURE, error });
  }
}

function* updateMemberMessageWatcherSaga() {
  yield takeLatest(UPDATE_MEMBER_MESSAGE_REQUEST, updateMemberMessageResult);
}

export {
  getMemberCompleteMessagesWatcherSaga,
  updateMemberMessageWatcherSaga,
  getMessageTabInfoWatcherSaga,
  getMemberMessagesWatcherSaga,
  replyMemberMessageWatcherSaga,
  newMessagesWatcherSaga,
};
