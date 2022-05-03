import React, { Component } from 'react';
import moment from 'moment';
import { Alert, Tooltip } from 'reactstrap';
import { connect } from 'react-redux';
import { getProfileTabInfo } from '../../actions';
import { _global } from '../../helpers/global';
import './style/style.scss';
import {withRouter} from 'react-router-dom';

class DetailsHeader extends Component {
  constructor(props) {
    super();
    this.state = {
      tooltipOpen: false
    };
  }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  // textCaseConverter = name => {
  //   if (name) {
  //     return name
  //       .split(' ')
  //       .map(nameVal => nameVal.charAt(0) + nameVal.slice(1).toLowerCase())
  //       .join(' ');
  //   }
  // };

  getProfileTabInfo = () => {
    this.props.history.push(
      '/member-details/' + this.props.callerId + '#' + sessionStorage.getItem('param')
    );
    this.props.getProfileTabInfo({
      memberUuid: window.atob(this.props.callerId),
      loadDependentProfile: true
    })
  }

  render() {
    const callerInfo = this.props.callerInfo;
    const memberInfo = this.props.memberInfo;
    const callerId = this.props.callerId;
    const memberId = this.props.memberId;
    const accessApprovalLevel = this.props.accessApprovalLevel;
    const familyId = this.props.callerInfo && this.props.callerInfo.memberId;

    return (
      <>
        {callerId !== memberId &&
          accessApprovalLevel &&
          accessApprovalLevel.toLowerCase() === 'partial' && this.props.memberFamilyProfile.memberDetail ? (
            <>
              <Alert color="danger" className="message-container">
                <div className="left-align">
                  <i className="icon icon-edit icon-edit-pencil" />{' '}
                  <span className="text-initial">{
                    callerInfo && _global.textCaseConverter(callerInfo.name)
                  }</span>
                  {' '}has{' '}
                  <span href="#" id="partialAccessTooltip">
                    PARTIAL ACCESS
                </span>{' '}
                to {' '}<span className="text-initial">{
                    _global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.name)
                  }</span>
                </div>
              </Alert>
              <Tooltip
                placement="bottom"
                isOpen={this.state.tooltipOpen}
                autohide={false}
                target="partialAccessTooltip"
                toggle={this.toggle}
              >
                User has Partial Access on this member's profile.
            </Tooltip>
            </>
          ) : (
            ''
          )}
        {callerId !== memberId &&
          accessApprovalLevel &&
          accessApprovalLevel.toLowerCase() === 'full' && this.props.memberFamilyProfile.memberDetail ? (
            <>
              <Alert color="success" className="message-container">
                <div className="left-align">
                  <i className="icon icon-edit icon-edit-pencil" />{' '}
                  <span className="text-initial">{
                    _global.textCaseConverter(callerInfo.name)
                  }</span>
                  {' '}has{' '}
                  <span href="#" id="fullAccessTooltip">
                    FULL ACCESS
                </span>{' '}
                to{' '}
                  <span className="text-initial">{
                    _global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.name)
                  }</span>
                </div>
              </Alert>
              <Tooltip
                placement="bottom"
                isOpen={this.state.tooltipOpen}
                autohide={false}
                target="fullAccessTooltip"
                toggle={this.toggle}
              >
                User has Full Access on this member's profile.
            </Tooltip>
            </>
          ) : (
            ''
          )}
        {callerId !== memberId &&
          accessApprovalLevel &&
          accessApprovalLevel.toLowerCase() === 'none' && this.props.memberFamilyProfile.memberDetail ? (
            <>
              <Alert color="danger" className="message-container">
                <div className="left-align">
                  <i className="icon icon-edit icon-edit-pencil" />{' '}
                  <span className="text-initial">{
                    _global.textCaseConverter(callerInfo.name)
                  }</span>
                  {' '}has{' '}
                  <span href="#" id="noAccessTooltip">
                    NO ACCESS
                </span>{' '}
                to{' '}
                  <span className="text-initial">{
                    _global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.name)
                  }</span>


                </div>
              </Alert>
              <Tooltip
                className="tooltip"
                placement="bottom"
                isOpen={this.state.tooltipOpen}
                autohide={false}
                target="noAccessTooltip"
                toggle={this.toggle}
              >
                User has No Access on this member's profile.
            </Tooltip>
            </>
          ) : (
            ''
          )}
        <div className="margin-top-50"></div>

        <div className="member-details">
          {this.props.callerInfo ? (
            <div
              className={`block arrow flex ${
                !this.props.memberFamilyProfile.memberDetail ||
                  this.props.memberFamilyProfile.memberDetail.memberId == this.props.callerInfo.memberId
                  ? 'primary'
                  : ''
                // !this.props.memberInfo ||
                // // this.props.memberInfo 
                //   (this.props.memberInfo.memberId !== this.props.memberFamilyProfile && this.props.memberFamilyProfile.memberDetail && this.props.memberFamilyProfile.memberDetail.memberId)
                //   ? 'primary'
                //   : ''

                }`}
            >
              <h2
                className="subscriberName"
                onClick={this.getProfileTabInfo}
              >
                {_global.textCaseConverter(callerInfo.name)}
              </h2>
              <div className="member-list">
                <strong>DOB</strong>{' '}
                <span>
                  {callerInfo.dob ? moment(callerInfo.dob).format('L') : '-'}
                </span>
              </div>
              <div className="member-list">
                <strong>
                  Family (
                  {callerInfo.familyCount ? callerInfo.familyCount : '-'})
                </strong>{' '}
                <span>
                  {callerInfo.eligibilityType
                    ? _global.textCaseConverter(callerInfo.eligibilityType)
                    : '-'}
                </span>
              </div>
              <div className="member-list">
                <strong>Effective Date</strong>{' '}
                <span>
                  {callerInfo.effectiveDate
                    ? moment(callerInfo.effectiveDate).format('L')
                    : '-'}
                </span>
              </div>
              <div className="member-list">
                <strong>Member ID</strong>{' '}
                <span>{familyId ? familyId : '-'}</span>
              </div>
              <div className="member-list">
                <strong>Status</strong>{' '}
                <span>
                  {callerInfo.memberStatus
                    ? _global.textCaseConverter(callerInfo.memberStatus)
                    : '-'}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="member-details">
          {this.props.memberFamilyProfile.memberDetail && callerId !== this.props.memberId ? (
            <div
              className={`arrow block flex ${
                this.props.memberFamilyProfile.memberDetail ? 'primary' : ''
                }`}
            >
              <h2>{_global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.name)}</h2>
              <div className="member-list">
                <strong>DOB</strong>{' '}
                {this.props.memberFamilyProfile.memberDetail.dob ? moment(this.props.memberFamilyProfile.memberDetail.dob).format('L') : '-'}
              </div>
              <div className="member-list">
                <strong>
                  Family (
                  {this.props.memberFamilyProfile.memberDetail.familyCount ? this.props.memberFamilyProfile.memberDetail.familyCount : '-'})
                </strong>{' '}
                {this.props.memberFamilyProfile.memberDetail.eligibilityType
                  ? _global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.eligibilityType)
                  : '-'}
              </div>
              <div className="member-list">
                <strong>Effective Date</strong>{' '}
                <span>
                  {this.props.memberFamilyProfile.memberDetail.effectiveDate
                    ? moment(this.props.memberFamilyProfile.memberDetail.effectiveDate).format('L')
                    : '-'}
                </span>
              </div>
              <div className="member-list">
                <strong>Member ID</strong>{' '}
                <span>{familyId ? familyId : '-'}</span>
              </div>
              <div className="member-list">
                <strong>Status</strong>{' '}
                {this.props.memberFamilyProfile.memberDetail.memberStatus
                  ? _global.textCaseConverter(this.props.memberFamilyProfile.memberDetail.memberStatus)
                  : '-'}
              </div>
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    callerInfo: state.memberProfile.callerInfo,
    memberId: state.memberProfile.memberInfo.id,
    callerId: state.memberProfile.callerInfo.id,
    memberInfo: state.memberProfile.memberDetail,
    accessApprovalLevel: state.memberProfile.memberInfo.accessOnDependent,
    memberFamilyProfile: state.memberFamilyProfile
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProfileTabInfo: (reqObj) => dispatch(getProfileTabInfo(reqObj))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DetailsHeader));
