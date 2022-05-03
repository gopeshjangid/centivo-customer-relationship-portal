import React, { Component } from 'react';
import moment from 'moment';
import Table from '@trendmicro/react-table';
import {
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Loader } from './../wrapper';
import {
  getProfileTabInfo,
  getDependentList,
  updateAccessApproval,
  getFamilyMemberRequest,
  setDependentToggle,
  setDependentAccessApproval,
  setMemberId
} from './../../actions';
import { connect } from 'react-redux';
import './scss/dependentList.scss';
import {withRouter} from 'react-router-dom';

const gridJson = [
  {
    title: 'Member Name',
    render: (value, row, index) => {
      return row.membername;
    }
  },
  {
    title: 'Eligibility Type',
    className: 'eligibilityType',
    render: (value, row, index) => {
      return row.eligibilitytype;
    }
  },
  {
    title: 'Date of Birth',
    className: 'dob',
    render: (value, row, index) => {
      return row.dateofbirth;
    }
  },
  {
    title: 'Activation Status',
    className: 'activationStatus',
    render: (value, row, index) => {
      return row.activationStatus;
    }
  },
  {
    title: 'Access Approval',
    className: 'p-absolute',
    render: (value, row, index) => {
      return row.accessapproval;
    }
  }
];

let tableHeight = null;


class DependentList extends Component {
  constructor(props) {
    super(props);
    let reqObj = {
      memberUuid: this.props.memberId
    }
    this.props.getDependentList(reqObj);

  }

  
  handleClickRow = record => {
    this.props.setDependentToggle(!this.props.isDependent)
    const {memberUuid, accessApproval} = record;
    let requestJSON = {
      memberUuid
    }
    this.props.setDependentAccessApproval(accessApproval)
    this.props.getFamilyMemberRequest(requestJSON);
    this.props.setMemberId(window.btoa(record.memberUuid))
    this.props.history.push('/member-details/' + window.btoa(memberUuid) + '#' + sessionStorage.getItem('param'))
  };

  toggleAccess = (accessApproval, grantorMemberUuid) => {
    const memAccessApprovalObj = {
      accessType: accessApproval,
      granteeMemberUuid: grantorMemberUuid,
      grantorMemberUuid: window.atob(this.props.memberId)

    };
    this.props.updateAccessApproval(memAccessApprovalObj);
  };

  
  render() {
    const familyMembers = this.props.familyMembers;
    const loading = this.props.loading;
    let data = [];
    if (familyMembers && familyMembers.length > 0) {
      data = familyMembers.map(member => ({
        memberUuid: member.memberUuid,
        membername: member.name ? (
          <Button
            color={'link'}
            onClick={e => {
              this.handleClickRow(member);
            }}
            disabled={member.memberUuid === window.atob(this.props.memberId)}
          >
            {member.name}
          </Button>
        ) : (
          '-'
        ),
        eligibilitytype: member.eligibilityType ? member.eligibilityType : '-',
        dateofbirth: member.dob ? moment(member.dob).format('L') : '-',
        activationStatus: member.activationStatus
          ? member.activationStatus
          : '-',
        accessApprovalLevel: member.accessApproval,
        accessapproval:
          member.accessApproval === 'FULL' ||
          member.accessApproval === 'PARTIAL' ||
          member.accessApproval === 'NONE' ? (
            <>
              <UncontrolledDropdown>
                <DropdownToggle
                  color={'link'}
                  disabled={
                    member.memberUuid === window.atob(this.props.memberId)
                  }
                >
                  {member.accessApproval.toUpperCase()}
                </DropdownToggle>
                <DropdownMenu className="access-approval">
                  <DropdownItem
                    active={
                      member.accessApproval.toLowerCase() === 'full'
                        ? true
                        : false
                    }
                    onClick={() => this.toggleAccess('FULL', member.memberUuid)}
                  >
                    Full
                  </DropdownItem>
                  <DropdownItem
                    active={
                      member.accessApproval.toLowerCase() === 'partial'
                        ? true
                        : false
                    }
                    onClick={() =>
                      this.toggleAccess('PARTIAL', member.memberUuid)
                    }
                  >
                    Partial
                  </DropdownItem>
                  <DropdownItem
                    active={
                      member.accessApproval.toLowerCase() === 'none'
                        ? true
                        : false
                    }
                    onClick={() => this.toggleAccess('NONE', member.memberUuid)}
                  >
                    None
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </>
          ) : (
            <span className="button-dash">&ndash;</span>
          )
      }));
    }

    return this.props.networkErrorBoolean ? (
      <div className="error-header text-center color-label">
          We are unable to process this request as of now. Please try again later.
      </div>
    ) : familyMembers && familyMembers.length > 0 && !loading ? (
      <div className="tab-page-container member-tab dependant-tab">
        <Table
          id="dependentList"
          columns={gridJson}
          data={data}
          hoverable={false}
          justified={false}
          useFixedHeader={true}
          maxHeight={tableHeight}
          rowKey={record => record.memberUuid}
        />
      </div>
    ) : <Loader />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getFamilyMemberRequest: (memberUuid)=>dispatch(getFamilyMemberRequest(memberUuid)),
    getDependentList: (memberId)=>dispatch(getDependentList(memberId)),
    getProfileTabInfo: () => dispatch(getProfileTabInfo()),
    updateAccessApproval: reqObj => dispatch(updateAccessApproval(reqObj)),
    setDependentToggle: reqObj => dispatch(setDependentToggle(reqObj)),
    setDependentAccessApproval: reqObj => dispatch(setDependentAccessApproval(reqObj)),
    setMemberId: memberId => dispatch(setMemberId(memberId))
  }
}

function mapStateToProps(state) {
  return {
    loading: state.memberDependents.loading,
    callerUid: state.memberProfile.callerInfo.id,
    profileInfo: state.memberProfile.memberInfo.profile,
    familyMembers: state.memberDependents.details,
    networkErrorBoolean: state.memberDependents.networkError,
    isDependent: state.memberProfile.memberInfo.isDependent
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(DependentList));
