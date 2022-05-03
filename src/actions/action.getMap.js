import * as actionType from '../constants/constant.action';

export const getMap = (reqObj)=> ({
  type:actionType.GET_LOCATION_REQUESTED,
  payload:reqObj
})

const getMapSuccess = resourceResponse => ({
  type: actionType.GET_LOCATION_SUCCESS,
  payload: {
    resourceResponse
  }
});

const getMapFailure = error => ({
  type: actionType.GET_LOCATION_FAILURE,
  payload: {
    error
  }
});