import React, { Component } from "react";
import Layout from "../layout/layout";
import { formConstants } from "../../constants";
import { ClipLoader } from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";
import {
  Form,
  FormGroup,
  Col,
  Input,
  Label,
  Row,
  Button,
  NavLink,
} from "reactstrap";
import { withRouter } from "react-router-dom";
import { getMap } from "../../actions/action.getMap";
import { connect } from "react-redux";
import { _global } from "../../helpers/global";
import Select from "react-select";
import "./css/providerDirectory.css";
//import axios from "axios";
import providerClient from "centivo-api-clients/packages/provider-client/index";
import ProviderListItem from "./providerListItems";
import searchIcon from "../../assets/icons/search@2x.png";
import mapIcon from "../../assets/icons/map-pin@1x.svg";
// require('./css/memberSearch.css');
import {
  selectProvider,
  providerList,
  setLoading,
  filterProviderList,
  clearFilterproviderList,
  clearSelectedProvider,
} from "../../actions/action.providerDirectory";
class ProviderDirectoryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormSubmitted: false,
      clientName: "",
      specialtyList: [],
      networkList: [],
      doctorList: [],
      filter: null,
      initialFilter: {
        practitionarName: "",
        npi: "",
      },
      form: {
        specialty: "",
        network: "",
        distance: 100,
        zipCode: "",
        practitionarName: "",
        npiNumber: "",
        gender: "anygender",
      },
      error: {
        client: false,
        specialty: false,
        zipCode: false,
      },
      showSearchResult: false,
      keyPressedEvent: {
        validKey: true,
        backspace: false,
      },
    };
  }

  containerRef = React.createRef(null);

  validateForm = () => {
    const _error = { ...this.state.error };

    if (this.state.form.network === "") {
      _error.client = true;
    }

    if (this.state.form.zipCode === "") {
      _error.zipCode = true;
    }
    if (this.state.form.specialty === "") {
      _error.specialty = true;
    }

    if (Object.values(_error).some((v) => v)) {
      this.setState({ ...this.state, error: _error, isFormSubmitted: false });
      return false;
    }
    return true;
  };

  searchMember = async () => {
    this.setState({ isFormSubmitted: true });

    if (this.validateForm() === false) {
      return false;
    }

    this.props.setLoading(true);
    let doctorList = await providerClient.getDoctorsByNetworkZipCodeAndSpecialty(
      this.state.form.zipCode,
      this.state.form.network.value,
      this.state.form.specialty.value || "",
      this.state.form.distance
    );
    const initialFilter = {
      practitionarName: this.state.form.practitionarName,
      npi: this.state.form.npi,
    };

    this.setState({ isFormSubmitted: false, initialFilter });
    this.props.saveProviderList({
      doctorList,
      filter: {
        practitionarName: this.state.form.practitionarName,
        npi: this.state.form.npiNumber,
      },
      form: this.state.form,
    });
    this.props.setLoading(false);
    
    if (!this.props.gMapKey) {
      this.props.getMap();
    }

    return doctorList;
  };

  chooseProvider = async (provider) => {
    this.props.setLoading(true);
    let doctorDetails = await providerClient.getDoctorsByNpiNetworkLatAndLong(
      provider.npi,
      provider.network,
      provider.lat,
      provider.long
    );
    const doctor = doctorDetails.length ? doctorDetails[0] : null;
    this.props.chooseAction("DETAIL");
    this.props.selectProvider({ ...doctor, distance: provider.distance });
  };

  componentDidMount = async () => {
    let networkList = await providerClient.getAllNetworks();
    networkList = networkList.map((network) => {
      return {
        label: network.providerDomainNetwork,
        value: network.providerDomainNetwork,
      };
    });
    let specialtyList = await providerClient.getSpecialties();
    specialtyList = specialtyList.map((sp) => {
      return { label: sp.specialty, value: sp.code };
    });
    this.setState({ specialtyList: specialtyList, networkList: networkList });
    window.scrollBy(0, -600);
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.selectedProvider && this.props.actionPage === "BACK") {
      this.props.clearSelectedProvider("SEARCH");
      this.setState({
        actionName: "SEARCH",
        initialFilter: this.props.initialFilter,
        form: { ...this.state.form, ...this.props.form },
      });
    }

    if (prevProps.providerList !== this.props.providerList) {
      window.scrollBy(0, -600);
    }

    if (prevProps.providerList !== this.props.providerList) {
      this.setState({ showSearchResult: true });
    }
  }

  handleChange = (e) => {
    const _error = { ...this.state.error };
    const name = e.target.name;
    const value = e.target.value;

    if (_error.zipCode) {
      _error.zipCode = value === "" ? true : false;
    }
    this.setState((prev) => ({
      form: { ...prev.form, [name]: value },
      error: _error,
    }));
  };

  onClientChange = (e) => {
    const _error = { ...this.state.error };
    if (_error.client) {
      _error.client = e.value === "" ? true : false;
    }

    this.setState((prev) => ({
      form: { ...prev.form, network: e },
      error: _error,
    }));
  };

  onSpecialityChange = (e) => {
    const _error = { ...this.state.error };
    if (_error.specialty) {
      _error.specialty = e.value === "" ? true : false;
    }

    this.setState((prev) => ({
      form: { ...prev.form, specialty: e },
      error: _error,
    }));
  };

  clearLocation = (name) => {
    this.setState({ form: { ...this.state.form, [name]: "" } });
  };

  genderHandler = (e) => {
    e.preventDefault();
    this.onFilterChange(e);
  };

  onFilterChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.props.filterProviders({ ...this.props.filter, [name]: value });
  };

  checkBoxHandler = (e, value) => {
    const name = e.target.name;
    const flag = e.target.value !== "true";
    this.props.filterProviders({ ...this.props.filter, [name]: flag });
  };

  clearFilter = () => {
    this.props.clearProviders();
  };

  render() {
    const { form, error } = this.state;
    return (
      <Layout>
        <div
          ref={(ref) => (this.containerRef = ref)}
          className="form-container search"
        >
          <Row>
            <Col sm={{ size: 5 }} md={{ size: 5 }} lg={{ size: 5 }}>
              <Form className="input-custom member-search-form">
                <FormGroup row>
                  <Col sm={{ size: 8, offset: 3 }}>
                    <Label className="label">Select client</Label>
                    <Select
                      className="formSelect"
                      classNamePrefix="memberSelect-"
                      isSearchable={true}
                      placeholder={!this.state.form.network && "Select client"}
                      onChange={this.onClientChange}
                      options={this.state.networkList}
                      isClearable
                      value={this.state.form.network}
                      isLoading={!this.state.networkList.length}
                    />
                    {error.client && (
                      <span className="error-badge">Client is required.</span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={{ size: 8, offset: 3 }}>
                    <Label className="label">All specialties</Label>
                    <Select
                      className="formSelect"
                      classNamePrefix="memberSelect-"
                      onChange={this.onSpecialityChange}
                      placeholder={
                        !this.state.form.specialty.value && "Select Specialty"
                      }
                      options={this.state.specialtyList}
                      isClearable
                      value={this.state.form.specialty}
                      isLoading={!this.state.specialtyList.length}
                    />
                    {error.specialty && (
                      <span className="error-badge">
                        Specialty is required.
                      </span>
                    )}
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Col sm={{ size: 8, offset: 3 }} className="practitionarColumn">
                    <label className="label">Zip code</label>
                    <img className="mapIcon" src={mapIcon} />
                    <Input
                      type="text"
                      name="zipCode"
                      id="zipCode"
                      className="zipLocation formInput"
                      maxLength={5}
                      placeholder="Zip code"
                      value={form.zipCode}
                      onChange={this.handleChange}
                      tabIndex="3"
                    />
                    {this.state.form.zipCode &&
                      this.state.form.zipCode !== "" && (
                        <i
                          onClick={() => this.clearLocation("zipCode")}
                          name="zipCode"
                          className="zipCodeClose close-icon"
                        ></i>
                      )}
                    {error.zipCode && (
                      <span className="error-badge">Zip code is required</span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col
                    sm={{ size: 8, offset: 3 }}
                    className="practitionarBox"
                  >
                    <label className="label">Search by practioner name</label>
                    <img className="searchIcon" src={searchIcon} />
                    <Input
                      type="text"
                      name="practitionarName"
                      id="practitionarName"
                      placeholder="Search by practitionar name"
                      autoComplete="on"
                      maxLength="50"
                      value={this.state.form.practitionarName}
                      className="practinorNameField formInput"
                      onChange={this.handleChange}
                      tabIndex="4"
                    />
                    {this.state.form.practitionarName &&
                      this.state.form.practitionarName !== "" && (
                        <i
                          onClick={() => this.clearLocation("practitionarName")}
                          name="practitionarName"
                          className="close-icon"
                          type="reset"
                        ></i>
                      )}
                    {error.dob && this.state.isFormSubmitted && (
                      <span className="text-danger dobErrorMsg">
                        {" "}
                        {formConstants.FILL_DOB}{" "}
                      </span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={{ size: 8, offset: 3 }}>
                    <label className="label">NPI number</label>
                    <Input
                      type="text"
                      name="npiNumber"
                      id="npiNumber"
                      placeholder="NPI number"
                      autoComplete="on"
                      value={this.state.form.npiNumber}
                      className="formInput"
                      onChange={this.handleChange}
                      onKeyDown={this.handleDateChangeKeyPress}
                      tabIndex="4"
                    />

                    {error.dob && this.state.isFormSubmitted && (
                      <span className="text-danger dobErrorMsg">
                        {" "}
                        {formConstants.FILL_DOB}{" "}
                      </span>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col sm={{ size: 8, offset: 3 }} className="">
                    <Button
                      type="button"
                      disabled={
                        this.state.isFormSubmitted ||
                        (this.state.form.zipCode === "" &&
                          this.state.form.network === "" &&
                          this.state.form.specialty === "")
                      }
                      className={`search-btn ${"disabled-btn"}`}
                      onClick={this.searchMember}
                      tabIndex="5"
                    >
                      Search
                    </Button>
                  </Col>
                </FormGroup>
                {this.props.providerDirectory.isFilterApplied ||
                (!this.state.isFormSubmitted &&
                  this.props.providerList.length > 0) ? (
                  <>
                    <FormGroup row className="filterHeading">
                      <Col sm={{ size: 3, offset: 3 }}>
                        <label className="filter-label">Filters</label>
                      </Col>
                      <Col
                        sm={{ size: 5, offset: 0.2 }}
                        className="clearAllBox"
                      >
                        <NavLink
                          onClick={this.clearFilter}
                          tabIndex="5"
                          className="clear-all-btn"
                        >
                          Clear All
                        </NavLink>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col sm={{ size: 8, offset: 3 }}>
                        <div className="DistanceBox">
                          <div className="distanceContainer">
                            <label htmlFor="locationRange" className="label">
                              Distance
                            </label>
                            <input
                              type="range"
                              id="locationRange"
                              name="distance"
                              className="locationRange"
                              onChange={this.onFilterChange}
                              min="0"
                              max="100"
                              value={
                                this.props.filter.distance
                                  ? this.props.filter.distance
                                  : 100
                              }
                            />
                            <span className="distanceMilesText">
                              {this.props.filter.distance
                                ? this.props.filter.distance
                                : 100}{" "}
                              Miles
                            </span>
                          </div>
                        </div>

                        <div className="">
                          <label className="label">Gender</label>
                          <div className="primaryCareQuizField genderField">
                            <button
                              className={`genderBox ${this.props.filter
                                .gender === "" && "genderSelected"}`}
                              name="gender"
                              autoFocus
                              value=""
                              onClick={this.genderHandler}
                            >
                              Any Gender
                            </button>
                            <button
                              onClick={this.genderHandler}
                              className={`genderBox ${this.props.filter &&
                                this.props.filter.gender === "f" &&
                                "genderSelected"}`}
                              name="gender"
                              value="f"
                            >
                              Female
                            </button>
                            <button
                              className={`genderBox ${this.props.filter &&
                                this.props.filter.gender === "m" &&
                                "genderSelected"}`}
                              name="gender"
                              value="m"
                              onClick={this.genderHandler}
                            >
                              Male
                            </button>
                          </div>
                          <div className="AcceptNewCheckbox ">
                            <label className="label acceptNewPatient">
                              Accepting new patients
                            </label>
                            <Input
                              type="checkbox"
                              id="acceptingNewPatients"
                              name="isAcceptingNewPatients"
                              onChange={(e) =>
                                this.checkBoxHandler(
                                  e,
                                  this.props.filter.isAcceptingNewPatients !==
                                    "true"
                                )
                              }
                              checked={
                                this.props.filter.isAcceptingNewPatients ===
                                true
                              }
                              value={this.props.filter.isAcceptingNewPatients}
                            />
                          </div>
                        </div>
                      </Col>
                    </FormGroup>
                  </>
                ) : (
                  <></>
                )}
              </Form>
            </Col>
            <Col sm={{ size: 6 }} md={{ size: 6 }} lg={{ size: 6 }}>
              {this.props.loading ? (
                <div className="text-center">
                  <ClipLoader loading={this.props.loading} />
                </div>
              ) : (
                <ProviderListItem
                  practitionarName={this.state.initialFilter.practitionarName}
                  chooseProvider={this.chooseProvider}
                  providersList={this.props.providerList}
                  isFilterApplied={this.props.providerDirectory.isFilterApplied}
                  distance={this.props.filter.distance}
                  initialFilter={this.props.initialFilter}
                  showSearchResult={this.state.showSearchResult}
                />
              )}
            </Col>
          </Row>
        </div>
      </Layout>
    );
  }
}

/**
 * redux mapping of dispatched events to props function
 * @param {object} dispatch
 * @return {object}
 */
const mapDispatchToProps = (dispatch) => ({
  selectProvider: (details) => dispatch(selectProvider(details)),
  saveProviderList: (list) => dispatch(providerList(list)),
  setLoading: (status) => dispatch(setLoading(status)),
  filterProviders: (data) => dispatch(filterProviderList(data)),
  clearProviders: (data) => dispatch(clearFilterproviderList(data)),
  clearSelectedProvider: (data) => dispatch(clearSelectedProvider(data)),
  getMap: () => dispatch(getMap()),
});

/**
 * redux mapping of state to props function
 * @param {object} state
 * @return {object}
 */
const mapStateToProps = (state) => {
  return {
    ...state,
    providerList: state.providerDirectory.providerList,
    loading: state.providerDirectory.loading,
    filter: state.providerDirectory.filter,
    isFilterApplied: state.providerDirectory.isFilterApplied,
    selectedProvider: state.providerDirectory.selectedProvider,
    initialFilter: state.providerDirectory.initialFilter,
    actionPage: state.providerDirectory.actionPage,
    form: state.providerDirectory.form,
    gMapKey: state.providerDirectory.gMapKey,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProviderDirectoryComponent));
