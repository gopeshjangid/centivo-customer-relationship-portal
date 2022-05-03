
import * as actionType from '../constants/constant.action';
// import { serviceAPI } from '../services/service.api';
// // import { history } from '../helpers';


export const selectProvider = requestJSON => ({
    type:actionType.SELECT_PROVIDER,
    payload:requestJSON
  })

  export const providerList = requestJSON => ({
    type:actionType.SAVE_PROVIDER_LIST,
    payload:requestJSON
  })

  export const setLoading = requestJSON => ({
    type:actionType.SET_LOADING,
    payload:requestJSON
  })

  export const filterProviderList = requestJSON => ({
    type:actionType.FILTER_PROVIDER_LIST,
    payload:requestJSON
  })

  export const clearFilterproviderList = requestJSON => ({
    type:actionType.CLEAR_FILTER_PROVIDER_LIST,
    payload:requestJSON
  })

  export const clearAllData = requestJSON => ({
    type:actionType.CLEAR_ALL_DATA,
    payload:requestJSON
  })

  export const clearSelectedProvider = requestJSON => ({
    type:actionType.CLEAR_SELECTED_PROVIDER,
    payload:requestJSON
  })

