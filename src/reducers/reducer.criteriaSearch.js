import * as actionType from '../constants/constant.action';

const defaultState = {
  selectedMembersCount: 0
};

const criteriaSearch = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SELECTED_MEMBERS_COUNT:
      return Object.assign({}, state, {
        selectedMembersCount: action.payload.selectedMembersCount
      });

    case actionType.SET_CLEAR_FORM:
      return Object.assign({}, defaultState, {});

    default:
      return state;
  }
};

export default criteriaSearch;
