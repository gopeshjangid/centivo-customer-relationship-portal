
import * as actionType from '../constants/constant.action';
// import { serviceAPI } from '../services/service.api';
// // import { history } from '../helpers';


export const getMembersBySearch = requestJSON => ({
    type:actionType.FIND_MEMBER_REQUESTED,
    payload:requestJSON
  })

export const clearMemberSearch = ()=>({
  type:actionType.CLEAR_MEMBER_SEARCH
})

export const clearMemberSearchResult = () => ({
  type: actionType.CLEAR_MEMBER_SEARCH_RESULT
})


/**
 * Summary: set clear search form
 * Description: set clear search form on click of clear btn
 * @param {boolean} loadingBoolean
 */
// export const setClearSearchForm = () => {
//   return dispatch => {
//     dispatch(setClearForm());
//   };
// };
export const setClearForm = () => ({
  type: actionType.SET_CLEAR_FORM,
  payload: {}
});
/**
 * Summary: set loading boolean to true
 * Description: set loading boolean to true
 * @param {boolean} loadingBoolean
 */
export const setLoading = loadingBoolean => ({
  type: actionType.SET_LOADING,
  payload: {
    loading: loadingBoolean
  }
});

/**
 * Summary: set server errors
 * Description: set server errors on search page
 * @param {boolean} loadingBoolean
 */
export const setError = searchError => ({
  type: actionType.SET_SERVER_ERROR,
  payload: {
    searchError: searchError
  }
});

/**
 * Summary: set clear search form
 * Description: set clear search form
 */
export const setClearSearchForm = () => ({
  type: actionType.SET_CLEAR_FORM,
  payload: {}
});

/**
 * Summary: set details of the searched members
 * Description: set details of the searched members in table if members > 1
 * @param {Array} members
 */
export const setSearchedMembersList = members => ({
  type: actionType.SET_SERCHED_MEMBERS_LIST,
  payload: {
    members: members
  }
});

export const setFamilyId = familyID => ({
  type: actionType.SET_FAMILY_ID,
  payload: {
    familyID: familyID
  }
});

export const clearMemberData = () => ({
  type: actionType.CLEAR_MEMBER_DATA
})