import * as actionType from '../constants/constant.action';

export const setSelectedMembersCount = selectedMembersCount => ({
  type: actionType.SET_SELECTED_MEMBERS_COUNT,
  payload: {
    selectedMembersCount: selectedMembersCount
  }
});


export const setClearMembersCount = () => ({
  type: actionType.SET_CLEAR_FORM,
  payload: {}
});


export const clearSelectedMembersCount = () => {
  return dispatch => {
    dispatch(setClearMembersCount());
  };
};
