let _sessionToken = sessionStorage.getItem('_sessionToken');

export const token = {
  getToken,
  setToken,
  setTokenInRequest
};

function setToken(token) {
  _sessionToken = token;
  sessionStorage._sessionToken = token;
}

function getToken() {
  return _sessionToken;
}

function setTokenInRequest(requestData = {}) {
  if (!_sessionToken) return requestData;
  requestData['sessionToken'] = _sessionToken;
  return requestData;
}
