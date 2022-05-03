import * as actionType from '../constants/constant.action';
// import { getResources } from './../services/service.api';

export const getResources = (reqObj)=> ({
  type:actionType.GET_RESOURCES_REQUEST,
  payload:reqObj
})

// const getResourcesSuccess = resourceResponse => ({
//   type: actionType.GET_RESOURCES_SUCCESS,
//   payload: {
//     resourceResponse
//   }
// });

// const getResourcesFailure = error => ({
//   type: actionType.GET_RESOURCES_FAILURE,
//   payload: {
//     error
//   }
// });

// const getResourcesReq = () => ({
//   type: actionType.GET_RESOURCES
// });

// export const getResources = clientId => {
//   return dispatch => {
//     dispatch(getResourcesReq());
//     serviceAPI
//       .getResourcesRequest({ clientId })
//       .then(response => dispatch(getResourcesSuccess(response)))
//       .catch(err => dispatch(getResourcesFailure(err)));
//   };
// };
