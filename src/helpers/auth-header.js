/**
 * Description: returns header params to the request
 * @return {object} Content-Type, charset, Accept, Authorization
 */
function authHeader() {
  let userdata = 'Basic ' + window.btoa('');
  return {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    Authorization: userdata
  };
}

export { authHeader };
