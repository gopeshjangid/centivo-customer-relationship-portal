import React, { Component } from 'react';
import { keyConstants, formConstants } from '../../constants';
import { Loader } from './../../components/wrapper';

import Amplify from 'aws-amplify';
import Auth from '@aws-amplify/auth';
import { withOAuth } from 'aws-amplify-react';
//require('./../../config/config.amplify');


const initialState = {
  username: '',
  password: '',
  submitted: false,
  verificationFailed: false,
  verificationFailedMessage: '',
  alert: { type: null, message: null }
};

let config = null;

class ButtonContent extends React.Component {
  render() {
    return (
      <span>
        <i className="fa fa-unlock-alt" aria-hidden="true" />
        Login by Azure
      </span>
    );
  }
}


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = initialState;
    // Amplify.configure({
    //   Auth: {
    //     identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    //     region: process.env.REACT_APP_REGION,
    //     userPoolId: process.env.REACT_APP_USER_POOL_ID,
    //     userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    //     oauth: {
    //       domain: process.env.REACT_APP_DOMAIN,
    //       scope: [
    //         'phone',
    //         'email',
    //         'profile',
    //         'openid',
    //         'aws.cognito.signin.user.admin'
    //       ],
    //       redirectSignIn: process.env.REACT_APP_REDIRECT_SIGNIN,
    //       redirectSignOut: process.env.REACT_APP_REDIRECT_SIGNOUT,
    //       responseType: 'token',

    //       options: {
    //         AdvancedSecurityDataCollectionFlag: true,
    //         popup: true
    //       }
    //     }
    //   }
    // });

    config = Auth.configure();
    sessionStorage.removeItem('sessionTimeOut');
    sessionStorage.removeItem('_sessionToken');
    sessionStorage.removeItem('param');
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  componentDidMount() {
    this.handleLogin();
  }


  handleEnterKeyPress = e => {
    this.setState({ alert: { type: null, message: null } });
    if (e.charCode === keyConstants.ENTER) {
      this.handleSubmit(e);
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    sessionStorage._sessionToken = '';
    sessionStorage.setItem('loginClient', 'cognito');
    this.setState({ submitted: true });
    const { username, password } = this.state;
    if (username && password) {
      Auth.signIn(username, password)
        .then(user => {
          this.getUserInfo(user);
        })
        .catch(err => {
          this.setState({
            verificationFailed: true,
            verificationFailedMessage: err.message
          });
        });
    }
  };

  getUserInfo = user => {
    Auth.currentSession()
      .then(data => {
        let param =
          'access_token=' +
          data.accessToken.jwtToken +
          '&id_token=' +
          data.idToken.jwtToken;
        sessionStorage.setItem('param', param);
        this.props.history.push('/member-search#' + param);
      })
      .catch(err => console.log(err));
  };

  handleLogin = () => {
    const { domain, redirectSignIn, responseType } = config.oauth;
    const clientId = config.userPoolWebClientId;
    console.log("config" ,config)
    sessionStorage.setItem('loginClient', 'azure');
    // const url =
    //   'https://' +
    //   domain +
    //   '/login?redirect_uri=' +
    //   redirectSignIn +
    //   '&response_type=' +
    //   responseType +
    //   '&client_id=' +
    //   clientId;
    // sessionStorage.setItem('isLoggedIn', true);
    // sessionStorage.setItem('userSignedIn', true);
    // window.location.assign(url);
  };

  handleLogout = () => {
    // Amplify.configure({
    //   Auth: {
    //     identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    //     region: process.env.REACT_APP_REGION,
    //     userPoolId: process.env.REACT_APP_USER_POOL_ID,
    //     userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    //     oauth: {
    //       domain: process.env.REACT_APP_DOMAIN,
    //       scope: [
    //         'phone',
    //         'email',
    //         'profile',
    //         'openid',
    //         'aws.cognito.signin.user.admin'
    //       ],
    //       redirectSignIn: process.env.REACT_APP_REDIRECT_SIGNIN,
    //       redirectSignOut: process.env.REACT_APP_REDIRECT_SIGNOUT,
    //       responseType: 'token',
    //       options: {
    //         AdvancedSecurityDataCollectionFlag: true
    //       }
    //     }
    //   }
    // });

    const config = Auth.configure();
    const { domain, redirectSignOut } = config.oauth;
    const clientId = config.userPoolWebClientId;
    const url =
      'https://' +
      domain +
      '/logout?logout_uri=' +
      redirectSignOut +
      '&client_id=' +
      clientId;
    window.location.assign(url);
  };

  /** 
   * Description: render to html 
   * @param {null} 
   * @return {string} 
   */
  render() {
    return <Loader />;
  }
}

export default withOAuth(Login); 