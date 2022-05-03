import * as actionType from '../constants/constant.action';

const defaultState = {};

const memberFamilyProfile = (state = defaultState, action) => {
    switch (action.type) {
        case actionType.GET_FAMILY_MEMBER_REQUEST:
            return {
                ...state
            }

        case actionType.GET_FAMILY_MEMBER_SUCCESS:
            return {
                ...state,
                ...action.payload
            }

        case actionType.TOGGLE_GET_MEMBER_INFO_SUCCESS:
            return {
              ...state,
              ...action.payload              
            }

        case actionType.GET_FAMILY_MEMBER_FAILURE:
            return {
                ...state,
                ...action.payload
            }

        case actionType.SET_MEMBER_PROFILE:
            return defaultState

        case actionType.CLEAR_MEMBER_DATA:
            return defaultState

        default:
            return state
    }
}

export default memberFamilyProfile;
