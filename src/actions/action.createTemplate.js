import * as actionType from '../constants/constant.action';
import { serviceAPI } from '../services/service.api';


export const createMsgTemplate = template => {
  return dispatch => {
    dispatch(setLoading(true));
    serviceAPI
      .createMessageTemplate(template)
      .then(resp => {
        if (resp.data) {
          dispatch(setTemplate(resp.data));
          dispatch(
            setSuccess(resp.data.name + ' template successfully created. ')
          );
        } else {
          dispatch(
            setError('requested template is not created, please try again !!')
          );
        }
        dispatch(setLoading(false));
      })
      .catch(error => {
        console.log('Error!  ' + error);
      });
  };
};


export const setSuccess = createTemplateSuccess => ({
  type: actionType.SET_SERVER_SUCCESS,
  payload: {
    createTemplateSuccess: createTemplateSuccess
  }
});


export const setError = createTemplateError => ({
  type: actionType.SET_SERVER_ERROR,
  payload: {
    createTemplateError: createTemplateError
  }
});

export const setLoading = loadingBoolean => ({
  type: actionType.SET_LOADING,
  payload: {
    loading: loadingBoolean
  }
});

/**
 * Summary: reset member details reducer to initial state on tab click
 * Description: reset member details reducer to initial state on tab click
 */
export const setDefaultStateInReducer = () => ({
  type: actionType.SET_DEFAULT_STATE_IN_REDUCER,
  payload: {}
});

/**
 * Summary: set details of the searched members
 * Description: set details of the searched members in table if members > 1
 * @param {object} template
 */
export const setTemplate = template => ({
  type: actionType.SET_TEMPLATE,
  payload: {
    template: template
  }
});
