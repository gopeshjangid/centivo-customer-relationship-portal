import { call, put, takeLatest } from "redux-saga/effects";
import {
  GET_MEMBER_CARE_INFO_REQUEST,
  SET_CARE_DETAILS,
  GET_MEMBERS_DATA_REQUEST,
  GET_MEMBER_CARE_INFO_SUCCESS,
  GET_MEMBER_CARE_INFO_FAILURE,
  SEARCH_PCP_FAILURE,
  SEARCH_PCP_SUCCESS,
  SEARCH_PCP_REQUEST,
  UPDATE_MEMBER_STATUS_REQUEST,
  UPDATE_MEMBER_STATUS_SUCCESS,
  UPDATE_MEMBER_STATUS_FAILURE,
  PCP_UPDATE_REQUEST,
  PCP_UPDATE_ACTIVATION_REQUEST,
  PCP_UPDATE_SUCCESS,
  PCP_UPDATE_FAILURE,
  SYNC_FAMILY_CLAIM_LIST_START,
  SYNC_FAMILY_CLAIM_LIST_SUCCESS,
  SYNC_FAMILY_CLAIM_LIST_FAILURE,
} from "../constants";
import { api } from "../services";
import {delay} from 'redux-saga/effects'
//import { history } from './../helpers/history';

function* searchPcpResult(action) {
  try {
    const result = yield call(api.searchPcp, action.payload);
    if (result.data && result.status === 200) {
      yield put({ type: SEARCH_PCP_SUCCESS, payload: result.data });
    } else {
      yield put({ type: SEARCH_PCP_FAILURE, payload: result.response.data.error.message });
    }
  } catch (error) {
    yield put({ type: SEARCH_PCP_FAILURE });
  }
}

export function* searchPcpWatcherSaga() {
  yield takeLatest(SEARCH_PCP_REQUEST, searchPcpResult);
}

function* getCareResult(action) {
  try {
    const result = yield call(api.getCareInfo, action.payload);
    if (result.data && result.status === 200) {
      yield put({ type: GET_MEMBER_CARE_INFO_SUCCESS, payload: result.data });
    } else if (result.response.status === 404) {
      yield put({ type: GET_MEMBER_CARE_INFO_SUCCESS, payload: [] });
    } else {
      yield put({ type: GET_MEMBER_CARE_INFO_FAILURE, payload: result.data.error.message });
    }
  } catch (error) {
    yield put({ type: GET_MEMBER_CARE_INFO_FAILURE });
  }
}

export default function* memberCareWatcherSaga() {
  yield takeLatest(GET_MEMBER_CARE_INFO_REQUEST, getCareResult);
}

function* updateMemberStatusResult(action) {
  try {
    const result = yield call(api.getTempMemberPortalLogin, action.payload);
    if (result.data) {
      yield put({
        type: UPDATE_MEMBER_STATUS_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: UPDATE_MEMBER_STATUS_FAILURE,
      });
    }
  } catch (e) {
    yield put({
      type: UPDATE_MEMBER_STATUS_FAILURE,
    });
  }
}

export function* updateMemberStatusWatcherSaga() {
  yield takeLatest(UPDATE_MEMBER_STATUS_REQUEST, updateMemberStatusResult);
}

function* updatePcpResult(action) {
  try {
    const result = yield call(api.updatePcp, action.payload);
    if (result.status === 200) {
      yield put({
        type: PCP_UPDATE_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: PCP_UPDATE_FAILURE,
        payload: result.response.data.error.message,
      });
    }

    yield put({
      type: GET_MEMBER_CARE_INFO_REQUEST,
      payload: {
        memberUuid: action.payload.memberUuid,
      },
    });
  } catch (e) {
    yield put({
      type: PCP_UPDATE_FAILURE,
      payload: e,
    });
  }
}

export function* updatePcpWatcherSaga() {
  yield takeLatest(PCP_UPDATE_REQUEST, updatePcpResult);
}

function* updatePcpActivationResult(action) {
  const { employeeCertificateNumber, ...rest } = action.payload;
  try {
    const result = yield call(api.updatePcp, rest);
    if (result.status === 200) {
      yield put({
        type: PCP_UPDATE_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: PCP_UPDATE_FAILURE,
        payload: result.response.data.error.message,
      });
    }

    yield put({
      type: GET_MEMBERS_DATA_REQUEST,
      payload: {
        employeeCertificateNumber: employeeCertificateNumber,
      },
    });
  } catch (e) {
    yield put({
      type: PCP_UPDATE_FAILURE,
      payload: e,
    });
    yield put({
      type: GET_MEMBERS_DATA_REQUEST,
      payload: {
        employeeCertificateNumber: employeeCertificateNumber,
      },
    });
  }
}

function* syncFamilyCareList({ payload }) {
 // console.log(payload);
  try {
    const result = yield call(api.syncFamilyClaimList, payload);
    yield delay(30000);
    if (result.status !== 200) {
      yield put({
        type: SYNC_FAMILY_CLAIM_LIST_FAILURE,
      });
    } else {
      yield put({
        type: SYNC_FAMILY_CLAIM_LIST_SUCCESS,
      });
    }
  } catch (e) {
    yield put({
      type: SYNC_FAMILY_CLAIM_LIST_FAILURE,
    });
  }
}

export function* updatePcpActivationWatcherSaga() {
  yield takeLatest(PCP_UPDATE_ACTIVATION_REQUEST, updatePcpActivationResult);
}

export function* syncFamilyCareListWatcherSaga() {
  yield takeLatest(SYNC_FAMILY_CLAIM_LIST_START, syncFamilyCareList);
}
