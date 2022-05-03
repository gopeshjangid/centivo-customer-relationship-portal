import React, { Component } from 'react';
import { Container, Nav, NavItem, Navbar, Collapse, NavbarBrand } from 'reactstrap';
import { Link } from 'react-router-dom';
import Auth from '@aws-amplify/auth';
import {connect} from 'react-redux';
import './../../assets/scss/header.scss';
import {userLogoutRequest} from './../../actions';
import {withRouter} from 'react-router-dom'

const tabs = [
  {
    key: 'member-search',
    name: 'Member-Search'
  },
  {
    key: 'provider-directory',
    name: 'Provider Directory'
  },
  {
    key: 'resources',
    name: 'Resources'
  },
  {
    key: 'messages',
    name: 'Messages'
  }
];


class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      activeTabKey: 'member-search',
      logoutStatus: false,
    };
  }

  tabClickHandler = (event) => {
    let key = event.currentTarget.dataset.key;
    this.setState({activeTabKey: key})
  }
 
  logOutUser = () => {
    this.setState({
      logoutStatus: true
    });
    // if (sessionStorage.getItem('loginClient') === 'cognito') {
      sessionStorage.removeItem('loginClient');
      sessionStorage.setItem('userSignedIn', false);

      Auth.signOut({ global: true })
        .then(() => {
          this.props.userLogoutRequest();
          sessionStorage.clear();
          this.props.history.push('/');
        })
        .catch(error => {
          console.log(error);
        });

    // } else {
    //   sessionStorage.removeItem('loginClient');
    //   sessionStorage.setItem('userSignedIn', false);
    // }
  };


  render() {
    return (
      <>
        {
          (this.props.isUserLoggedIn || sessionStorage.getItem('param')) &&
          (

            <header className="header fixed-top">
              <Container>
                <Navbar color="light" light expand="md">
                  <NavbarBrand
                    href={'/member-search#' + sessionStorage.getItem('param')}
                  >
                    <img
                      src="https://s3.amazonaws.com/centivo-email-templates/CENHEA_18623-1_LogoWithTrademark_RGB.png"
                      alt=""
                      className="logo-navbar"
                    />
                  </NavbarBrand>
                  <>
                    <Navbar color="light">
                      <Collapse navbar>
                        <Nav className="ml-auto margin-top-5" navbar>
                          <>
                          {tabs.map(tab => {

                            
                              return (
                                <NavItem key={tab.key} className={
                                  (window.location.href.indexOf('member-details') !== -1
                                  && tab.key === 'member-search') ||
                                  window.location.href.indexOf(tab.key) !== -1
                                  ? 'active'
                                  : ''
                                  }
                                  data-key={tab.key}
                                  onClick={this.tabClickHandler}
                                >
                                  <Link
                                    to={
                                      '/' +
                                      tab.key +
                                      '#' +
                                      sessionStorage.getItem('param')
                                    }
                                    className="nav-link"
                                  >
                                    {tab.name}
                                  </Link>
                                </NavItem>)
                                })}
                             </>
                            <NavItem className="logout">
                              <i
                                className="icon icon-logout pointer"
                                onClick={() => this.logOutUser()}
                              />
                            </NavItem>
                        </Nav>
                      </Collapse>
                    </Navbar>
                  </>
                </Navbar>
              </Container>
            </header>
          )
        }
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  userLogoutRequest: () => dispatch(userLogoutRequest())
})

const mapStateToProps = state => ({
  isUserLoggedIn: state.login.userLoggedIn
})


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));