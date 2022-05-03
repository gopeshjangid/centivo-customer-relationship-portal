import * as actionType from '../constants/constant.action';

const defaultState = {
  loading: false,
  toggleAddress: false
}
const updateAddressReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.TOGGLE_ADDRESS_MODAL:
      return {
        ...state,
        toggleAddress: !state.toggleAddress
      }

    case actionType.UPDATE_ADDRESS_REQUEST:
      return {
        ...state,
        ...action.payload
      };

    case actionType.UPDATE_ADDRESS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        toggleAddress: false
      };

    case actionType.UPDATE_ADDRESS_FAILURE:
      return {
        ...state,
        ...action.payload,
        toggleAddress: false
      };

    default:
      return {
        ...state,
      };
  }
}


export default updateAddressReducer;
