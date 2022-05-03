import axios from 'axios';
import { history } from '../helpers/history';

const jwt = require('jsonwebtoken'),
  jwkToPem = require('jwk-to-pem');

export const validateToken = {
  init: init
};

let idToken = null,
  accessToken = null;

function getParameterByName(queryString) {
  var query = {};
  var pairs = (queryString[0] === '#'
    ? queryString.substr(1)
    : queryString
  ).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

function setCSREmail(decodedJWT) {
  if (sessionStorage.getItem('loginClient') === 'cognito') {
    sessionStorage.setItem(
      'csr_user_email',
      decodedJWT.payload["cognito:username"].toLowerCase()
    );
  } else {
    sessionStorage.setItem(
      'csr_user_email',
      decodedJWT.payload.identities[0].userId.toLowerCase()
    );
  }
}

function validateTokenwithPem(pems, accessToken) {
  let userPool_Id =
      'https://cognito-idp.' +
      process.env.REACT_APP_REGION +
      '.amazonaws.com/' +
      process.env.REACT_APP_USER_POOL_ID,
    decodedJWT = jwt.decode(accessToken, { complete: true }),
    kid = decodedJWT.header.kid;

  setCSREmail(jwt.decode(idToken, { complete: true }));

  let tokenInfo = new Promise((response, reject) => {
    // reject if its not a valid JWT token
    if (!decodedJWT) {
      reject('Not a valid JWT token');
    }

    // reject if ISS is not matching our userPool Id
    if (decodedJWT.payload.iss != userPool_Id) {
      reject({
        message: 'invalid issuer',
        iss: decodedJWT.payload
      });
    }

    // Reject the jwt if it's not an 'Access Token'
    if (decodedJWT.payload.token_use != 'access') {
      reject('Not an access token');
    }

    // Get jwtToken `kid` from header
    const pem = pems[kid];
    if (!pem) {
      reject('Invalid access token');
    }

    // verify the signature of the JWT token to ensure its really coming from your User Pool
    jwt.verify(accessToken, pem, { issuer: userPool_Id }, function(
      err,
      payload
    ) {
      if (err) {
        reject('Unauthorized signature for this JWT Token');
      } else {
        response(payload);
      }
    });
  });

  return tokenInfo;
}

function handleResponse(response) {
  const pems = {},
    jwt_set = response.data;

  if (jwt_set) {
    for (let i = 0; i < jwt_set.keys.length; i++) {
      const jwk = {
        kty: jwt_set.keys[i].kty,
        n: jwt_set.keys[i].n,
        e: jwt_set.keys[i].e
      };
      const pem = jwkToPem(jwk);
      pems[jwt_set.keys[i].kid] = pem;
    }
  }

  validateTokenwithPem(pems, accessToken)
    .then(data => {})
    .catch(err => {
      var alerted = sessionStorage.getItem('sessionTimeOut') || '';
      if (alerted != 'yes') {
        alert('Session Timed Out');
        sessionStorage.setItem('sessionTimeOut', 'yes');
      }
      // sessionStorage.removeItem('param');
      sessionStorage.clear();
      history.push('/');
      
    });
}

function handleError(error) {
  // sessionStorage.removeItem('param');
  sessionStorage.clear();
  history.push('/');
  
}

function init() {
  if (
    window.location.pathname !== '/' &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/unsubscribe' &&
    window.location.pathname !== '/admin'
  ) {
    idToken = getParameterByName(window.location.href.split('#')[1]).id_token;
    accessToken = getParameterByName(window.location.href.split('#')[1])
      .access_token;

    sessionStorage.setItem('param', window.location.href.split('#')[1]);

    if (accessToken) {
      axios
        .get(
          'https://cognito-idp.' +
            process.env.REACT_APP_REGION +
            '.amazonaws.com/' +
            process.env.REACT_APP_USER_POOL_ID +
            '/.well-known/jwks.json',
          { headers: '' }
        )
        .then(handleResponse)
        .catch(handleError);
    }
  }
}
