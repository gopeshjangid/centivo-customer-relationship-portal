import React from 'react';
import { bindActionCreators } from 'redux';
import {
  ListGroup,
  ListGroupItem,
  Form,
  Col,
  FormGroup,
  Label,
  Input,
  Alert,
  Row,
} from 'reactstrap';

import { connect } from 'react-redux';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Select from 'react-select';
import { getSpecialties, setSpecialityLoading} from './../../actions';

import { Loader } from './../wrapper';

require('./scss/care.scss');

class PcpChangeComponent extends React.Component {
  state = {
    distanceIconOpen: false
  };
  handleCheck = e => {
    this.setState({
      referralSelected: !this.state.referralSelected
    });
  };
  ClearIndicator = props => {
    const {
      getStyles,
      innerProps: { ref, ...restInnerProps }
    } = props;
    return (
      <div
        {...restInnerProps}
        ref={ref}
        style={getStyles('clearIndicator', props)}
      >
        <i className="icon icon-x-circle" />
      </div>
    );
  };

  handleClickDropdown = () => {
    this.setState({
      distanceIconOpen: !this.state.distanceIconOpen
    });
  };

  handleBlurDropdown = () => {
    this.setState({
      distanceIconOpen: false
    });
  };
  componentDidMount() {
    let reqObj = {};
    if (this.props.modalType != 'updatePcp') {
      reqObj.memberUuid = window.atob(this.props.memberId);
      this.props.setSpecialityLoading(true);
      this.props.getSpecialties(reqObj);
      
    }
  }
  render() {
    const data = this.props.pcpList && this.props.pcpList;
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? '#00A69E' : null,
        padding: '0 10px'
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
      },
      dropdownIndicator: (provided, state) => ({
        ...provided,
        display: 'none'
      }),
      indicatorSeparator: (provided, state) => {
        return null;
      },
      menuList: provided => ({
        ...provided,
        maxHeight: 280
      })
    };

    const customStyles2 = {
      option: (provided, state) => ({
        ...provided,
        color: state.isSelected ? 'white' : 'black',
        backgroundColor: state.isSelected ? '#00A69E' : null,
        padding: '0 10px'
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
      },
      dropdownIndicator: (provided, state) => ({
        ...provided,
        display: 'none'
      }),
      indicatorSeparator: (provided, state) => {
        return null;
      },
      menuList: provided => ({
        ...provided,
        maxHeight: 180
      })
    };
    let stateCarePointUuid =
      this.props.selectedPcp &&
      this.props.selectedPcp.providerSummary &&
      this.props.selectedPcp.providerSummary.carepointUuid,
      listingGroup;

    if (this.props.searchPcpListFailure) {
      listingGroup = (
        <Alert color="danger">{this.props.searchPcpListFailure}</Alert>
      );
    }

    if (data) {
      if (data.length === 0) {
        listingGroup = (
          <Alert color="danger" className="no-providers">
            <i className="icon icon-alert" />
            No providers found.
          </Alert>
        );
      } else {
        listingGroup = (
          <ListGroup>
            {' '}
            {data && data.map(obj => {
              let providerSummary = obj && obj.providerSummary,
                practiceSummary = obj && obj.practiceSummary,
                { practiceName = '-', phone = '-' } = practiceSummary,
                {
                  providerTitle = '',
                  providerFirstName = '',
                  providerLastName = ''
                } = providerSummary,
                {
                  street = '',
                  city = '',
                  state = '',
                  zip = ''
                } = practiceSummary.practiceAddress;
              let carePointUuid = obj.carePointUuid;

              return (
                <ListGroupItem
                  onClick={this.props.handleCheck}
                  data-obj={JSON.stringify(obj)}
                  className="pcp-list-item"
                  key={`${carePointUuid}`}
                  tag="button"
                  action
                >
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Provider Name</strong>
                    </Col>
                    <Col xs={7}>
                      <span>
                        {providerFirstName +
                          ' ' +
                          providerLastName +
                          ', ' +
                          providerTitle}
                      </span>
                    </Col>
                    <Col xs={1}>
                      <span
                        className={`referral-checkbox ${obj.isSelected ? 'active' : null
                          }`}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Specialty</strong>
                    </Col>
                    <Col xs={7}>
                      <span>{providerSummary.primarySpecialty}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Sub-specialty</strong>
                    </Col>
                    <Col xs={7}>
                      <span>-</span>
                    </Col>
                  </Row>        
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>NPI</strong>
                    </Col>
                    <Col xs={7}>
                      <span>{providerSummary.practitionerNpi}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Practice Name</strong>
                    </Col>
                    <Col xs={7}>
                      <span>{practiceName}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Address</strong>
                    </Col>
                    <Col xs={7}>
                      <span>
                        {street + ' ' + city + ' ' + state + ' ' + zip}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Phone</strong>
                    </Col>
                    <Col xs={7}>
                      <span>{phone ? phone : '-'}</span>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4} className="text-right">
                      <strong>Patient Age Range</strong>
                    </Col>
                    <Col xs={7}>
                      <span>{providerSummary.minAge ? providerSummary.minAge : 0}-{providerSummary.maxAge ? providerSummary.maxAge : 100}</span>
                    </Col>
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        );
      }
    }

    return listingGroup ? (
      listingGroup
    ) : (
        <>
          {this.props.hasError && (
            <Alert color="danger" className="no-providers">
              NPI or
              {this.props.modalType !== 'updatePcp' ? ' Specialty, ' : ' '}
            Last Name and Location is mandatory field.
            </Alert>
          )}
          {!this.props.pcploading ? (
            <Form className="create-referral-form">
              {!this.props.workflowRequest ? (
                this.props.referralWorkflow == 'Specialty Only' ? (
                  <FormGroup row className="alternative-workflow">
                    <Label for="specialty" xs={2}>
                      Specialty
                  </Label>
                    <Col xs={10}>
                      <Select
                        className={`basic-single ${this.props.hasError &&
                            !this.props.searchCriteria.specialties
                            ? 'error-box'
                            : null
                          }`}
                        classNamePrefix="select"
                        isDisabled={false}
                        components={this.ClearIndicator}
                        // isLoading={!referralProvider.specialtyList}
                        isClearable={true}
                        isSearchable={true}
                        name="specialty"
                        styles={customStyles}
                        options={this.props.specialties}
                        // defaultValue={this.props.searchCriteria}
                        onChange={e =>
                          this.props.handleDropDown('specialtyOnlyWorkflow', e)
                        }
                        menuIsOpen={true}
                        placeholder="Search Provider Specialty"
                        invalid={
                          this.props.hasError &&
                          !this.props.searchCriteria.specialties
                        }
                      />
                    </Col>
                  </FormGroup>
                ) : (
                    <div>
                      <FormGroup row className="m-0">
                        <Label for="required" md={12} className="required">
                          <span className="mandatory">*</span> Required fields
                    </Label>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="npi" xs={2}>
                          NPI number<span className="mandatory">*</span>
                        </Label>
                        <Col xs={10}>
                          <Input
                            invalid={this.props.invalidNpiError}
                            type="text"
                            name="npi"
                            id="npi"
                            placeholder="Enter NPI #"
                            data-type="npi"
                            value={this.props.searchCriteria.npi}
                            onChange={this.props.onChangeHandler}
                            className={
                              this.props.invalidNpiError ? 'text-danger' : null
                            }
                            onKeyPress={this.props.handleEnterKeyPress}
                          />
                          {this.props.invalidNpiError && (
                            <span className="error-message text-danger no-padding">
                              NPI not in correct format
                            </span>
                          )}
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Col
                          xs={{ offset: 2, size: 10 }}
                          className="text-center option-seperator"
                        >
                          <p>OR</p>
                        </Col>
                      </FormGroup>
                      {this.props.modalType !== 'updatePcp' && (
                        <FormGroup row>
                          <Label for="specialty" xs={2}>
                            Specialty<span className="mandatory">*</span>
                          </Label>
                          <Col xs={10}>
                            <Select
                              className={`basic-single ${this.props.hasError &&
                                  !this.props.searchCriteria.specialties
                                  ? 'error-box'
                                  : null
                                }`}
                              classNamePrefix="select"
                              isDisabled={false}
                              components={this.ClearIndicator}
                              // isLoading={!referralProvider.specialtyList}
                              isClearable={true}
                              isSearchable={true}
                              name="specialty"
                              styles={customStyles2}
                              options={this.props.specialties}
                              // defaultValue={[this.state.specialty.selectedOption]}
                              onChange={e =>
                                this.props.handleDropDown('fullWorkflow', e)
                              }
                              placeholder="Search Provider Specialty"
                              invalid={
                                this.props.hasError &&
                                !this.props.searchCriteria.specialties
                              }
                            />
                          </Col>
                        </FormGroup>
                      )}

                      <FormGroup row>
                        <Label for="firstName" xs={2}>
                          First Name
                        </Label>
                        <Col xs={10}>
                          <Input
                            type="text"
                            name="firstName"
                            id="firstName"
                            placeholder="Enter Provider's First Name"
                            data-type="firstName"
                            value={this.props.searchCriteria.firstName}
                            onChange={this.props.onChangeHandler}
                            onKeyPress={this.props.handleEnterKeyPress}
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="lastName" xs={2}>
                          Last Name<span className="mandatory">*</span>
                        </Label>
                        <Col xs={10}>
                          <Input
                            type="text"
                            name="lastName"
                            id="lastName"
                            placeholder="Enter Provider's Last Name"
                            data-type="lastName"
                            value={this.props.searchCriteria.lastName}
                            onChange={this.props.onChangeHandler}
                            onKeyPress={this.props.handleEnterKeyPress}
                            invalid={
                              this.props.hasError && !this.props.searchCriteria.lastName
                            }
                          />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <Label for="pcpDistance" xs={2}>
                          Location<span className="mandatory">*</span>
                        </Label>
                        <Col xs={6}>
                          <Input
                            type="text"
                            name="location"
                            id="location"
                            placeholder="Zip Code or City"
                            data-type="location"
                            value={this.props.searchCriteria.location}
                            onChange={this.props.onChangeHandler}
                            onKeyPress={this.props.handleEnterKeyPress}
                            invalid={
                              this.props.hasError && !this.props.searchCriteria.location
                            }
                          />
                        </Col>
                        <Col xs={4}>
                          <Input
                            type="select"
                            name="distance"
                            id="distance"
                            data-type="distance"
                            value={this.props.searchCriteria.distance}
                            onChange={this.props.onChangeHandler}
                            className={
                              this.state.distanceIconOpen
                                ? 'distance-dropdown-up'
                                : 'distance-dropdown-down'
                            }
                            onClick={this.handleClickDropdown}
                            onBlur={this.handleBlurDropdown}
                          >
                            <option value="10">Within 10 miles</option>
                            <option value="20">Within 20 miles</option>
                            <option value="30">Within 30 miles</option>
                            <option value="40">Within 40 miles</option>
                            <option value="50">Within 50 miles</option>
                          </Input>
                        </Col>
                      </FormGroup>
                    </div>
                )
                ) : <Loader />}
            </Form>
                  ) : <Loader />}
        </>
          );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSpecialties: reqObj => dispatch(getSpecialties(reqObj)),   
    setSpecialityLoading: reqObj => dispatch(setSpecialityLoading(reqObj))
  }
};
const mapStateToProps = state => ({
            pcpList: state.memberCare.pcpList,
  searchPcpListZero: state.memberCare.searchPcpListZero,
  searchPcpListFailure: state.memberCare.searchPcpListFailure,
  setPcpListFailure: state.memberCare.setPcpListFailure,
  specialties: state.referralDetails.specialties,
  referralWorkflow: state.referralDetails.referralWorkflow,
  workflowRequest: state.referralDetails.workflowRequest,
  pcploading : state.referralDetails.pcploading
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PcpChangeComponent);
