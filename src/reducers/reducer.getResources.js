import * as actionType from '../constants/constant.action';

const defaultState = {
  fetching: false,
  resourceResponse: {}
};

const resourceReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.GET_RESOURCES_REQUEST:
      return {
        ...state,
        fetching: true
      };
    case actionType.GET_RESOURCES_SUCCESS:
      return {
        ...state,
        fetching: false,
        resourceResponse: action.payload
      };
    case actionType.GET_RESOURCES_FAILURE:
      return {
        ...state,
        fetching: false,
        resourceResponse: {}
      };

    default:
      return state;
  }
};

export default resourceReducer;
