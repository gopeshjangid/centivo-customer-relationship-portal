import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Admin } from './containers/admin';
import Amplify from 'aws-amplify';

const Login = lazy(() => import('./containers/login'))
const MemberSearch = lazy(() => import('./containers/memberSearch'))
const Resources = lazy(() => import('./containers/resources/resources'))
const MemberDetails = lazy(() => import('./containers/memberDetails/memberDetails'))
const MessageList = lazy(() => import('./containers/messageList/messageList'))
const Header = lazy(() => import('./components/header'))
const PrivateRoute = lazy(() => import('./utils/PrivateRoute'))
const ProviderDirectory = lazy(() => import('./containers/providerDirectory/providerDirectory'))

const routes = (
    <Suspense fallback={<div />}>
        <Header />
        <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/admin" component={Admin} />
            <PrivateRoute exact path="/member-search" component={MemberSearch} />
            <PrivateRoute exact path="/provider-directory" component={ProviderDirectory} />
            <PrivateRoute exact path="/resources" component={Resources} />
            <PrivateRoute exact path="/member-details/:memberId" component={MemberDetails} />
            <PrivateRoute exact path="/messages" component={MessageList} />
            {/* <Route exact path="/new-message" component={newMessage} /> */}
            {/* <Redirect from="/" to="/admin" /> */}
        </Switch>
    </Suspense>
)
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
          AdvancedSecurityDataCollectionFlag: true,
          popup: true
        }
      }
    }
  });

export default routes