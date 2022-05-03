/**
 * Summary: Member Search Page
 * Description: Member Search Page container
 * @link:  /member-search
 * @author Prateek Jain
 * @date  17.09.2018
 */

import React, { Component } from 'react';
import Layout from '../layout/layout';
import { formConstants } from '../../constants';
import { ClipLoader } from 'react-spinners';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { Form, FormGroup, Col, Input, Label, Row, Button } from 'reactstrap';
import { Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom'
import Grid from '../../components/Grid';
import {
  getMembersBySearch,
  setClearSearchForm,
  setFamilyId,
  clearMemberData,
  clearMemberSearchResult
} from '../../actions';
import { connect } from 'react-redux';
import Auth from '@aws-amplify/auth';
import { _global } from '../../helpers/global';
import './css/memberSearch.scss';

Auth.configure(process.env.REACT_APP_REGION);

// require('./css/memberSearch.css');

/*
 * Member search page table column name with mapping key array
 */
const gridJson = [
  {
    title: 'Member Name',
    render: (value, row, index) => {
      return row.membername;
    }
  },
  {
    title: 'ID',
    render: (value, row, index) => {
      return row.id;
    }
  },
  {
    title: 'Member Type',
    render: (value, row, index) => {
      return row.memberType;
    }
  },
  {
    title: 'Status',
    render: (value, row, index) => {
      return row.status;
    }
  },
  {
    title: 'Effective Date',
    render: (value, row, index) => {
      return row.effectivedate;
    }
  },
  {
    title: 'Phone',
    render: (value, row, index) => {
      return row.phone;
    }
  },
  {
    title: 'City',
    render: (value, row, index) => {
      return row.city;
    }
  },
  {
    title: 'State',
    render: (value, row, index) => {
      return row.state;
    }
  },
  {
    title: 'Zip',
    render: (value, row, index) => {
      return row.zip;
    }
  }
];

/**
 * Member search related functionality
 * @param {null}
 * @return {string}
 * @author Prateek Jain
 * @date  17.09.2018
 */
class MemberSearchComponent extends Component {
  constructor(props) {
    super(props);
    this.dt = '';
    this.state = {
      isFormSubmitted: false,
      form: {
        memberId: '',
        firstName: '',
        lastName: '',
        //dob: moment()
        dob: ''
      },
      error: {
        lastName: false,
        dob: false,
        memberId: false
      },
      keyPressedEvent: {
        validKey: true,
        backspace: false
      }
    };
    this.searchMember = this.searchMember.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleClear();
  }

  /**
   * React componentDidMount event
   */
  componentDidMount = () => {
    this.props.clearMemberData();
  };

  /**
   * Description: search members
   * @param {event}
   * @return {object}
   * @author Prateek Jain
   * @date  17.09.2018
   */

  searchMember = e => {
    e.preventDefault();
    this.handleClear();

    this.setState({
      isFormSubmitted: true
    });
    
    const { form, error } = this.state;
    let reqParam = {};


    if (form.memberId === '') {
      if (form.lastName === '' && form.dob === '') {
        this.setState({
          error: {
            ...this.state.error,
            memberId: true,
            lastName: true,
            dob:true
          }
        });
        return false;
      }
      else {
        this.setState({
          error: {
            ...this.state.error,
            memberId: false
          }
        });
      }
    }

    if (form.lastName === '' && form.memberId === '') {
      this.setState({
        error: {
          ...this.state.error,
          lastName: true
        }
      });
      return false;
    }
    if ((form.dob === '' || !this._isValidDate(form.dob)) && form.memberId === '') {
      this.setState({
        error: {
          ...this.state.error,
          dob: true
        }
      });
      return false;
    }
  

    if (form.memberId != '') {
      reqParam.familyId = form.memberId.trim().toUpperCase();
    }
    else {
      if (form.firstName != '') {
        reqParam.firstName = form.firstName.trim();
      }

      if (form.lastName != '') {
        reqParam.lastName = form.lastName.trim();
      }

      if (form.dob != '' && this._isValidDate(form.dob)) {
        let mdate =
          form.dob.split('/')[2] +
          form.dob.split('/')[0] +
          form.dob.split('/')[1];

        reqParam.dob = mdate;
      }
      
    }

    this.props.getMembersBySearch(reqParam);





    // this.setState({
    //   error: {
    //     lastName: false,
    //     dob: false,
    //     memberId: false
    //   },
    //   isFormSubmitted: true
    // });
    // this.props.setClearSearchForm();
    // // const isValid = this._validate();
    // const { form, error } = this.state;
    // let mdate;
    // if (form.dob) {
    //   mdate =
    //     form.dob.split('/')[2] +
    //     form.dob.split('/')[0] +
    //     form.dob.split('/')[1];
    // }
    // if (form.memberId !== '') {
    //   let reqParam = {
    //     lastName: form.lastName.trim(),
    //     dob: mdate // YYYYMMDD
    //   };
    //   if (form.memberId) reqParam.familyId = form.memberId.trim().toUpperCase();
    //   if (form.firstName) reqParam.firstName = form.firstName.trim();
    //   //reqParam = {lastName:"Engles",dob:"19680120"}
    //   this.props.getMembersBySearch(reqParam);
    // } else if (form.lastName !== '' && this._isValidDate(form.dob)) {
    //   let reqParam = {
    //     lastName: form.lastName.trim(),
    //     dob: mdate // YYYYMMDD
    //   };
    //   if (form.memberId) reqParam.familyId = form.memberId.trim().toUpperCase();
    //   if (form.firstName) reqParam.firstName = form.firstName.trim();
    //   //reqParam = {lastName:"Engles",dob:"19680120"}
    //   this.props.getMembersBySearch(reqParam);
    // } else {
    //   let dataKeys = Object.keys(form).filter(keys => keys !== 'firstName');
    //   dataKeys.forEach(dataKey => {
    //     if (form[dataKey] == '') {
    //       this.setState({
    //         error: {
    //           memberId:
    //             form.memberId == '' && form.lastName == '' && form.dob == ''
    //               ? true
    //               : false,
    //           lastName: form.lastName == '' ? true : false,
    //           dob: form.dob == '' ? true : false
    //         }
    //       });
    //     } else {
    //       this.setState({
    //         error: {
    //           memberId:
    //             form.memberId == '' && form.lastName == '' && form.dob == ''
    //               ? true
    //               : false,
    //           lastName: form.lastName == '' ? true : false,
    //           dob: !this._isValidDate(form.dob)
    //         }
    //       });
    //     }
    //   });
    // }




    // if (isValid) {
    //   let reqParam = {
    //     lastName: form.lastName.trim(),
    //     dob: mdate // YYYYMMDD
    //   };
    //   if (form.memberId) reqParam.familyId = form.memberId.trim();
    //   if (form.firstName) reqParam.firstName = form.firstName.trim();
    //   //reqParam = {lastName:"Engles",dob:"19680120"}
    //   this.props.getMembersBySearchgetMembersBySearch(reqParam);
    // }
  };

  /**
   * Description: For redirect to member detail
   * @param {memberUuid}
   * @return {null}
   * @author Prateek Jain
   * @date  28.09.2018
   */
  goToMemberDetail = (memberUuid, id) => {
    memberUuid = window.btoa(memberUuid);
    this.props.setFamilyId(id);
    this.props.history.push(
      '/member-details/' + memberUuid + '#' + sessionStorage.getItem('param')
    );
  };

  /**
   * Description: For Form reset
   * @param {event}
   * @return {null}
   * @author Prateek Jain
   * @date  17.09.2018
   */
  handleClear = event => {
    event &&
      this.setState({
        form: {
          memberId: '',
          firstName: '',
          lastName: '',
          dob: ''
        },
        error: {
          lastName: false,
          dob: false,
          memberId: false
        },
        isFormSubmitted: false
      });
    this.props.setClearSearchForm();
    this.props.clearMemberSearchResult();
  };

  /**
   * Summary: check date is valid
   * Description: check date is valid or not
   * @param {null}
   * @return {boolean}
   * @author Prateek Jain
   * @date  01.10.2018
   */
  _isValidDate = dob => {
    if (dob.length < 10) {
      return false;
    }

    if (dob) {
      const re = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
      if (!re.test(dob)) return false;
      return true;
    }
    return true;
  };

  /**
   * Summary: validate the Form field
   * Description: validation of Form fields
   * @param {null}
   * @return {boolean}
   * @author Prateek Jain
   * @date  17.09.2018
   */
  _validate = () => {
    const { form, error } = this.state;

    if (!form.lastName.length) {
      error.lastName = true;
    }
    if (!this._isValidDate(form.dob)) {
      error.dob = true;
    }
    if (!form.memberId.length) {
      if (!form.lastName.length && !this._isValidDate(form.dob)) {
        error.memberId = true;
      }
    } else {
      error.memberId = false;
      return true;
    }
    this.setState({ error: error });
    if (!error.memberId || !(error.lastName && error.dob)) {
      return true;
    }

    // if (!form.memberId.length) {
    //   error.memberId = true
    //   isError = true
    // }
    // else {
    //   return !isError
    // }
    // if (!form.lastName.length) {
    //   error.lastName = true;
    //   isError = true
    // }
    // error.dob = false;
    // if (!this._isValidDate(form.dob)) {
    //   error.dob = true;
    //   isError= true;
    // }

    // if(!form.memberId.length || (!form.lastName.length && !this._isValidDate(form.dob))){
    //   return true
    // }
    // return !isError;
  };

  /**
   * Description: handle change values
   * @param {event}
   * @return {null}
   * @author Prateek Jain
   * @date  17.09.2018
   */
  handleChange = e => {
    if (e === null || !e.target) return;
    let { form, error } = this.state;
    form[e.target.name] = e.target.value;
    error[e.target.name] = e.target.value ? false : true;
    if(e.target.name === 'lastName'){
      error.memberId =  false;
    }
    if(e.target.name === 'memberId'){
      error.dob =  false;
      error.lastName =  false;
    }
    this.setState({ form: form, error: error, isFormSubmitted: false });
  };

  /**
   * Description: handle change date
   * @param {dateObject}
   * @return {null}
   * @author Prateek Jain
   * @date  20.09.2018
   */


  handleDobValidation = e => {
    const { form, error } = this.state;
    if (this._isValidDate(form.dob)) {
      this.setState({
        error: {
          ...this.state.error,
          dob: false,
          memberId: false
        }
      });
    }
    else {
      this.setState({
        error: {
          ...this.state.error,
          dob: true
        }
      });
    }
  }
  handleDateChange = e => {
    if (this.state.keyPressedEvent.validKey) {
      let { form, error } = this.state;
      form.dob = e.target.value;
      if (!this.state.keyPressedEvent.backspace) {
        if (form.dob.length === 2 || form.dob.length === 5) {
          form.dob = form.dob + '/';
        }
      }
      this.setState({
        form: form,
        error: error
      });
    }
  };

  handleEnterPress = e => {
    if (e.which === 13) {
      this.searchMember(e);
    }
  };

  handleDateChangeKeyPress = e => {
    const validkeys = [
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      48,
      96,
      97,
      98,
      99,
      100,
      101,
      102,
      103,
      104,
      105,
      8,
      46,
      13
    ];
    if (validkeys.indexOf(e.which) < 0) {
      this.setState({
        keyPressedEvent: {
          backspace: false,
          validKey: false
        }
      });
    } else {
      if (e.which === 8 || e.which === 46) {
        this.setState({
          keyPressedEvent: {
            backspace: true,
            validKey: true
          }
        });
      } else if (e.which === 13) {
        this.searchMember(e);
      } else {
        this.setState({
          keyPressedEvent: {
            backspace: false,
            validKey: true
          }
        });
      }
    }
  };

  /**
   * Description: handle change date
   * @param {event}
   * @return {null}
   * @author Prateek Jain
   * @date  01.10.2018
   */
  handleRawDateChange(value) {
    this.dt = moment(value, 'MM/DD/YYYY');
  }

  /**
   * Description: row click helper function
   * @param {object} record
   * @return {number} index
   * @return {event} e
   * @author Prateek Jain
   * @date  01.10.2018
   */
  handleClickRow = (record, index, e) => {
    e.stopPropagation();
    e.preventDefault();
    this.goToMemberDetail(record.memberUuid, record.id);
  };

  /**
   * Description: render to html
   * @param {null}
   * @return {string}
   * @author Prateek Jain
   * @date  17.09.2018
   */
  render() {
    const { form, error } = this.state;
    let data = [];
    if (this.props.members && this.props.members.length === 1) {
      const { memberUuid, memberId } = this.props.members[0];
      this.goToMemberDetail(memberUuid, memberId)
    }
    if (this.props.members && this.props.members.length > 1) {
      data = this.props.members.map(member => ({
        memberUuid: member.memberUuid,
        membername: member.name ? member.name : '-',
        id: member.memberId,
        status: member.status ? member.status : '-',
        effectivedate: member.effectiveDate ? member.effectiveDate : '-',
        phone: member.phone ? _global.formatPhoneNumber(member.phone) : '-',
        city: member.city ? member.city : '-',
        state: member.state ? member.state : '-',
        zip: member.zip ? member.zip : '-',
        memberType: member.memberType ? member.memberType : '-'
      }));
    }

    return (
      <Layout>
        {this.props.searchError && !this.props.members.length && (
          <Alert color="danger" className="text-center">
            {this.props.searchError}
          </Alert>
        )}
        <div className="text-center">
          <ClipLoader loading={this.props.loading} />
        </div>
        <div className="form-container search">
          <Row>
            <Col
              sm={{ size: 12 }}
              md={{ size: 8, offset: 2 }}
              lg={{ size: 6, offset: 3 }}
            >
              <Form className="input-custom member-search-form">
                <FormGroup row>
                  <Label for="memberId" sm={4} className="text-right">
                    Member ID<span className="text-danger">*</span>
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="memberId"
                      id="memberId"
                      placeholder="Enter Member ID"
                      autoComplete="off"
                      value={form.memberId}
                      onChange={this.handleChange}
                      onKeyDown={this.handleEnterPress}
                      tabIndex="1"
                    />
                    {error.memberId && (
                      <span className="text-danger">
                        {' '}
                        {formConstants.FILL_MEMBER_ID}{' '}
                      </span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col
                    md={{ size: 8, offset: 4 }}
                    className="option-seperator text-center"
                  >
                    <p>OR</p>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="firstName" className="text-right" sm={4}>
                    First Name
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="Enter First Name"
                      autoComplete="off"
                      value={form.firstName}
                      onChange={this.handleChange}
                      onKeyDown={this.handleEnterPress}
                      tabIndex="2"
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="lastName" className="text-right" sm={4}>
                    Last Name<span className="text-danger">*</span>
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="Enter Last Name"
                      autoComplete="off"
                      value={form.lastName}
                      onChange={this.handleChange}
                      onKeyDown={this.handleEnterPress}
                      tabIndex="3"
                    />
                    {error.lastName && (
                      <span className="text-danger">
                        {' '}
                        {formConstants.FILL_LAST_NAME}{' '}
                      </span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="dob" className="text-right" sm={4}>
                    Date of Birth<span className="text-danger">*</span>
                  </Label>
                  <Col sm={8} className="custom-calendar">
                    <Input
                      type="text"
                      name="dob"
                      id="dob"
                      placeholder="MM/DD/YYYY"
                      autoComplete="off"
                      maxLength="10"
                      value={form.dob}
                      onChange={this.handleDateChange}
                      onKeyDown={this.handleDateChangeKeyPress}
                      onBlur={this.handleDobValidation}
                      tabIndex="4"
                    />
                    {error.dob && (
                      <span className="text-danger dobErrorMsg">
                        {' '}
                        {formConstants.FILL_DOB}{' '}
                      </span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col
                    sm={{ size: 8, offset: 4 }}
                    className="button-row-leftalign"
                  >
                    <Button
                      type="button"
                      color="info"
                      className="custom-round-btn"
                      onClick={this.searchMember}
                      tabIndex="5"
                    >
                      <i className="icon icon-search" /> Search
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      className="custom-round-btn"
                      onClick={this.handleClear}
                      tabIndex="6"
                    >
                      <i className="icon icon-closeWhite" /> Clear
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </div>
        {this.props.members && this.props.members.length > 1 && (
          <div className="table-container table-responsive search">
            <Grid
              id="memberSearch"
              columns={gridJson}
              data={data}
              hoverable={true}
              justified={false}
              useFixedHeader={true}
              rowKey={record => record.memberUuid}
              onRowClick={this.handleClickRow}
            />
          </div>
        )}
      </Layout>
    );
  }
}

/**
 * redux mapping of dispatched events to props function
 * @param {object} dispatch
 * @return {object}
 */
const mapDispatchToProps = dispatch => ({
  getMembersBySearch: reqObj => dispatch(getMembersBySearch(reqObj)),
  setClearSearchForm: () => dispatch(setClearSearchForm()),
  setFamilyId: id => dispatch(setFamilyId(id)),
  clearMemberData: () => dispatch(clearMemberData()),
  clearMemberSearchResult: () => dispatch(clearMemberSearchResult())
});

/**
 * redux mapping of state to props function
 * @param {object} state
 * @return {object}
 */
const mapStateToProps = state => {
  return {
    members: state.memberSearch.members,
    loading: state.memberSearch.loading,
    searchError: state.memberSearch.searchError
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MemberSearchComponent));
