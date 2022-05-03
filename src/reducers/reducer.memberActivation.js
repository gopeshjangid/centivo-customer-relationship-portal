import * as actionType from '../constants/constant.action';

const defaultState = {
  activationDetails: null,
  activationError: null,
  memberId: null
};

const memberActivation = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SERVER_ERROR:
      return Object.assign({}, state, {
        activationError: action.payload.activationError
      });

    
    default:
      return state;
  }
};

export default memberActivation;
