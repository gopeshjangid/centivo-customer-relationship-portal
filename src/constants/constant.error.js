export const httpErrorConst = {
    500: 'Internal Server Error.'
  };
  
  export const validCodes = code => {
    if (code >= 200 && code < 400) {
      return true;
    }
    return false;
  };
  
  export const invalidToken = {
    401: '401'
  };
  