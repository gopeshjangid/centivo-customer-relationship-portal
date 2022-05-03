import React, { Component } from 'react';
import classnames from 'classnames';
import { 
  Container,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
 } from 'reactstrap';
 import { DetailsHeader, Loader } from './../../components/wrapper';
// import Activation from './../../components/activation';
import Care from './../../components/care';
import Messages from './../../components/messages';
import Profile from './../../components/profile';
import DependentList from './../../components/dependentList';
import Referral from './../../components/referrals';
import {
  loadTab,
  getMemberInfo,
  setCallerMemberId
} from './../../actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'

class MemberDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMemberInfo:{},
      loading: false
    };
  
    let memberID = this.props.match.params.memberId;
    let requestJSON = {
        memberUuid:window.atob(memberID),
        sessionToken:sessionStorage.getItem("_sessionToken")
    }
    this.props.setCallerMemberId(memberID);
    this.props.getMemberInfo(requestJSON);
  }

  static getDerivedStateFromProps(props, state){
   if(props.callerInfo!==state.selectedMemberInfo){
     return {selectedMemberInfo:props.callerInfo}
   } 
   return null;
  }
  selectedMemberInfo = selectedMemberInfo => {
    this.setState({
      selectedMemberInfo
    });
  };
    
  renderTabContents = tabIdentifier => {
    const tabArray = this.props.tabArray;
    let activeTabIdentifier = null;

    tabArray.forEach(tab => {
      if (tab.isActive) {
        activeTabIdentifier = tab.identifier;
      }
    });

    switch (tabIdentifier) {
      case 'profile': {
        return tabIdentifier === activeTabIdentifier && <Profile memberId={this.props.match.params.memberId} />;
      }
      case 'care': {
        return (
          tabIdentifier === activeTabIdentifier && (
            <Care memberId={this.props.match.params.memberId} />
          )
        );
      }
      // case 'activation': {
      //   return (
      //     tabIdentifier === activeTabIdentifier && (
      //       <Activation memberId={this.props.match.params.memberId} />
      //     )
      //   );
      // }
      case 'messages': {
        return (
          tabIdentifier === activeTabIdentifier && (
            <Messages memberId={this.props.match.params.memberId} />
          )
        );
      }
      case 'family': {
        return tabIdentifier === activeTabIdentifier && <DependentList memberId={this.props.match.params.memberId} />;
      }
      case 'referral': {
        return (
          tabIdentifier === activeTabIdentifier && (
            <Referral memberId={this.props.match.params.memberId} 
            selectedMember={this.state.selectedMemberInfo}/>
          )
        );
      }
      default: {
        return (
          <Loader />
        );
      }
    }
  };

  
  render() {
    const tabArray = this.props.tabArray;
    const callerId = this.props.callerId;
    const memberId = this.props.memberId;
    let tabContainerClassName = null;
    let activeTab = null;

    tabArray.forEach(tab => {
      if (tab.isActive) {
        activeTab = tab.identifier;
      }
    });

    tabContainerClassName =
      callerId !== memberId
        ? 'tab-container custom-tab1 margin-top-30 with-notification'
        : 'tab-container custom-tab1 margin-top-30';

    return (
      <>
      <div className="container page-container">
        <DetailsHeader selectedMemberInfo={this.selectedMemberInfo}/>
        <div className={tabContainerClassName}>
          <Nav tabs>
            {tabArray ? (
              tabArray.map(tab => {
                return (
                  <NavItem key={tab.key}>
                    <NavLink
                      disabled={!tab.visible}
                      className={classnames({ active: tab.isActive })}
                      onClick={() => this.props.loadTab(tab.identifier)}
                    >
                      {tab.name}
                    </NavLink>
                  </NavItem>
                );
              })
            ) : <Loader />}
          </Nav>
          <TabContent activeTab={activeTab}>
            {tabArray ? (
              tabArray.map(tab => (
                <TabPane tabId={tab.identifier} key={tab.key}>
                  <div className="table-responsive tab-page-container member-tab">
                    {this.renderTabContents(tab.identifier)}
                  </div>
                </TabPane>
              ))
            ) : <Loader />}
          </TabContent>
        </div>
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
        getMemberInfo: (memberUuid)=>dispatch(getMemberInfo(memberUuid)),
        loadTab: (identifier) => dispatch(loadTab(identifier)),
        setCallerMemberId: (memberId) => dispatch(setCallerMemberId(memberId))
    })

function mapStateToProps(state) {
  return {
    memberProfile: state.memberProfile,
    tabArray: state.memberProfile.tabArray,
    memberId: state.memberProfile.memberInfo.id,
    callerId: state.memberProfile.callerInfo.id,
    updateSuccessMsg: state.memberProfile.memberInfo.updateAddressSuccess,
    updateAddressFail: state.memberProfile.memberInfo.updateAddressFail,
    updateResponse: state.memberProfile.memberInfo.respMsg,
    isFieldUpdated: state.memberProfile.memberInfo.isFieldUpdated,
    isFieldError: state.memberProfile.memberInfo.isFieldError,
    profileInfo: state.memberProfile.profile,
    loading: state.memberProfile.loading,
    memberInfo: state.memberProfile.memberInfo,
    isResetSuccessMsg: state.memberProfile.isResetSuccessMsg,
    callerInfo:state.memberProfile.callerInfo
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MemberDetails));