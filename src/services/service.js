import axios from 'axios';
import { validCodes } from '../constants';
import { token } from '../services';
export const baseService = {
  get,
  put,
  post,
  delete: _delete
};
export const methodType = {
  get: 'GET',
  put: 'PUT',
  post: 'POST',
  delete: 'DELETE'
};
//===========CRUD Operations=====================//

//Get Call
function get(url, header) {
  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${header}`
      }
    })
    .then(handleResponse)
    .catch(error);
}

// 'Access-Control-Allow-Origin': '*', 'access-control-allow-methods': '*',

//create Call
function put(url, header, body) {
  return axios
    .put(url, body, { headers: { Authorization: `Bearer ${header}` } })
    .then(handleResponse)
    .catch(error);
}
//update Call
function post(url, header, body) {
  if (header) {
    return axios
      .post(url, body, { headers: { Authorization: `Bearer ${header}` } })
      .then(handleResponse)
      .catch(error);
  }
  return axios
    .post(url, body, { headers: '' })
    .then(handleResponse)
    .catch(error);
}

// Delete Call (prefixed function name with underscore because delete is a reserved word in javascript)
function _delete(url, header, body) {
  return axios
    .delete(url, {
      headers: {
        Authorization: `Bearer ${header}`
      }
    })
    .then(handleResponse)
    .catch(error);
}

//callback of response (returns promise)
function handleResponse(response) {
  if (!validCodes(response.status)) {
    return Promise.reject(response);
  }
  response &&
    response.data &&
    response.data.sessionToken &&
    token.setToken(response.data.sessionToken);
  return response;
}

//callback of error
function error(error) {
  return error;
}
