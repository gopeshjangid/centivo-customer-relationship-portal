import Amplify, { Auth } from 'aws-amplify'

Amplify.configure({
    Auth: {
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      region: process.env.REACT_APP_REGION,
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
      oauth: {
        domain: process.env.REACT_APP_DOMAIN,
        scope: [
          'phone',
          'email',
          'profile',
          'openid',
          'aws.cognito.signin.user.admin'
        ],
        redirectSignIn: process.env.REACT_APP_REDIRECT_SIGNIN,
        redirectSignOut: process.env.REACT_APP_REDIRECT_SIGNOUT,
        responseType: 'token',
        options: {
          AdvancedSecurityDataCollectionFlag: true
        }
      },
      
    }
  });
  
Auth.configure();