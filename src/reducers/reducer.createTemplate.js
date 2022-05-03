import * as actionType from '../constants/constant.action';

const defaultState = {
  loading: false,
  template: null,
  createTemplateSuccess: '',
  createTemplateError: ''
};

const createTemplate = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.SET_SERVER_ERROR:
      return Object.assign({}, state, {
        createTemplateSuccess: action.payload.createTemplateSuccess
      });

    case actionType.SET_SERVER_SUCCESS:
      return Object.assign({}, state, {
        createTemplateSuccess: action.payload.createTemplateSuccess
      });

    case actionType.SET_LOADING:
      return Object.assign({}, state, {
        loading: action.payload.loading
      });

    case actionType.SET_DEFAULT_STATE_IN_REDUCER:
      return Object.assign({}, defaultState, {});

    case actionType.SET_TEMPLATE:
      return Object.assign({}, state, {
        template: action.payload.template
      });

    default:
      return state;
  }
};

export default createTemplate;
