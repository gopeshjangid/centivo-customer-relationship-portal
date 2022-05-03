import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "./../Grid";
import {
  Alert,
  Button,
  ModalHeader,
  Modal,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import PcpChangeComponent from "./../care/pcpChange";
import {
  getReferrals,
  setPcpDetail,
  searchPcp,
  createSubmitReferral,
  setOpenChangePcpModal,
  selectPcpItem,
} from "./../../actions";
import { _global } from "./../../helpers";
import { keyConstants } from "../../constants";
import { Loader } from "./../wrapper";
import "./scss/referrals.scss";

class Referral extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activationScreenPopup: false,
      tempEmail: "",
      tempPassword: "",
      pcpnameScreenPopup: false,
      pcpValidation: {},
      searchCriteria: {
        npi: "",
        lastName: "",
        firstName: "",
        distance: "10",
        location: "",
        specialty: "",
        pcpFlag: false,
        memberUuid: window.atob(this.props.memberId),
      },
      selectedPcp: null,
      isNotNpiName: false,
    };

    this.togglePcpModal = this.togglePcpModal.bind(this);
    this.cancelPcpModal = this.cancelPcpModal.bind(this);
    this.findPCPList = this.findPCPList.bind(this);
    this.getSelectedPcpInfo = this.getSelectedPcpInfo.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handlePcpUpdate = this.handlePcpUpdate.bind(this);
    this.searchAgain = this.searchAgain.bind(this);
    this.props.getReferrals(this.props.memberId);
  }

  submitReferral = () => {
    let requestJson = {
      memberUuid: window.atob(this.props.memberId),
      referralSpecialty: this.state.searchCriteria.specialty,
    };
    this.props.createSubmitReferral(requestJson);
    this.cancelPcpModal();
  };

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.pcpList) {
      if (this.state.pcpnameScreenPopup) {
        this.setState({ pcpnameScreenPopup: false });
      }
    }
  };

  handleCheck = (e) => {
    let select = JSON.parse(e.currentTarget.dataset.obj);
    select.modal = "referralPcp";
    this.setState({
      referralSelected: select.carePointUuid,
      selectedPcp: select,
    });

    this.props.selectPcpItem(select);
  };

  cancelPcpModal() {
    this.props.setOpenChangePcpModal(false);
    this.setState({
      referralSelected: false,
      invalidNpi: false,
      hasError: false,
    });
  }

  togglePcpModal = () => {
    this.props.setOpenChangePcpModal(true);
    this.props.setPcpDetail(null);
    this.setState({
      selectedPcp: null,
      searchCriteria: {
        ...this.state.searchCriteria,
        npi: "",
        lastName: "",
        firstName: "",
        location: "",
        specialty: "",
        pcpFlag: false,
        memberUuid: window.atob(this.props.memberId),
      },
    });
  };
  getSelectedPcpInfo = (e) => {
    let select = JSON.parse(e.currentTarget.dataset.obj);
    this.setState({ selectedPcp: select });
  };

  findPCPList() {
    let {
      npi,
      firstName,
      lastName,
      location,
      distance,
      specialty,
    } = this.state.searchCriteria;
    this.setState({
      hasError: false,
      invalidNpi: false,
    });
    if (
      (npi !== "" && !isNaN(npi)) ||
      (lastName !== "" &&
        location !== "" &&
        distance !== "" &&
        specialty !== "")
    ) {
      this.props.searchPcp(this.state.searchCriteria);
    } else {
      if (isNaN(npi)) {
        this.setState({
          invalidNpi: true,
        });
      } else if (
        npi === "" &&
        (lastName === "" ||
          location === "" ||
          distance === "" ||
          specialty === "")
      ) {
        this.setState({
          hasError: true,
        });

        return false;
      }
    }
  }

  searchAgain() {
    this.setState({
      searchCriteria: {
        npi: "",
        lastName: "",
        firstName: "",
        distance: "10",
        location: "",
        specialty: "",
        pcpFlag: false,
        memberUuid: window.atob(this.props.memberId),
      },
      referralSelected: false,
      invalidNpi: false,
      hasError: false,
    });
    this.props.setPcpDetail(null);
    this.setState({ selectedPcp: false });
  }
  handlePcpUpdate() {
    let referrals = this.props.pcpList.filter((pcpItem) => pcpItem.isSelected);
    // .filter(carePointUuid => carePointUuid !== null);

    let primaryReferral = referrals.splice(0, 1)[0];
    let requestJson = {
      memberUuid: window.atob(this.props.memberId),
      npi: primaryReferral.npi,
      key: primaryReferral.key,
      secondaryReferredToCarepoints: referrals,
    };

    this.props.createSubmitReferral(requestJson);

    this.setState({
      searchCriteria: {
        npi: "",
        lastName: "",
        firstName: "",
        distance: "10",
        location: "",
        specialty: "",
        pcpFlag: false,
        memberUuid: window.atob(this.props.memberId),
      },
      referralSelected: false,
    });
    this.cancelPcpModal();
  }

  handleDropDown = (workflow, e) => {
    if (e) {
      var storeVar = workflow == "specialtyOnlyWorkflow" ? e.label : e.value;

      this.setState({
        searchCriteria: {
          ...this.state.searchCriteria,
          specialty: storeVar.trim(),
        },
      });
    } else {
      this.setState({
        searchCriteria: {
          ...this.state.searchCriteria,
          specialty: "",
        },
      });
    }
  };

  onChangeHandler = (e) => {
    let storeVar = e.currentTarget.value,
      type = e.currentTarget.dataset.type;
    switch (type) {
      case "npi":
        return this.setState({
          searchCriteria: {
            ...this.state.searchCriteria,
            npi: storeVar.trim(),
          },
        });

      case "firstName":
        return this.setState({
          searchCriteria: {
            ...this.state.searchCriteria,
            firstName: storeVar.trim(),
          },
        });

      case "lastName":
        return this.setState({
          searchCriteria: {
            ...this.state.searchCriteria,
            lastName: storeVar.trim(),
          },
        });

      case "distance":
        return this.setState({
          searchCriteria: {
            ...this.state.searchCriteria,
            distance: storeVar.trim(),
          },
        });

      case "location":
        return this.setState({
          searchCriteria: {
            ...this.state.searchCriteria,
            location: storeVar,
          },
        });

      default:
        return this.state;
    }
  };

  handleEnterKeyPress = (e) => {
    if (e.charCode === keyConstants.ENTER) {
      this.findPCPList();
    }
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  render() {
    let tableData = this.props.referrals && this.props.referrals.referralsData;
    let complianceFlag =
      this.props.profile && this.props.profile.complianceFlag;
    const activatationJson = [
      {
        title: "Referral Id",
        key: "referralId",
        render: (value, row, index) => {
          return row.referralId;
        },
      },

      {
        sortable: true,
        enableServerSideSorting: false,
        title: "Referral Date",
        key: "referralDate",
        render: (value, row, index) => {
          return _global.formatDateStringFromTimestamp(row.referralDate);
        },
      },
      {
        title: "Referral Status",
        render: (value, row, index) => {
          return row.referralStatus;
        },
      },
      {
        title: "Expiration Date",
        render: (value, row, index) => {
          return row.expirationDate;
        },
      },
      {
        title: "Referring Provider Name",
        render: (value, row, index) => {
          return row.providerName ? row.providerName : "-";
        },
      },
      {
        title: "Referred Provider NPI",
        render: (value, row, index) => {
          return <div className="text-center">{row.providerNpi}</div>;
        },
      },
      {
        title: "Referred Provider Name",
        render: (value, row, index) => {
          return row.renderingProviderName;
        },
      },
      {
        title: "Referred Provider Specialty",
        render: (value, row, index) => {
          return row.providerSpeciality;
        },
      },
      {
        title: "Referred Provider Address",
        render: (value, row, index) => {
          if (
            row.providerAddress.zip == null &&
            row.providerAddress.state == null &&
            row.providerAddress.city == null &&
            row.providerAddress.street == null
          ) {
            return "-";
          } else if (row.providerAddress) {
            let { street, city, state, zip } = row.providerAddress;
            return (
              (street ? street + ", " : "") +
              (city ? city + ", " : "") +
              (state ? state + ", " : "") +
              (zip ? zip : "")
            );
          } else {
            return row.providerAddress;
          }
        },
      },
      {
        title: "Referred Provider Phone",
        render: (value, row, index) => {
          return (
            <div className="text-center">
              {row.providerPhone ? row.providerPhone : "-"}
            </div>
          );
        },
      },
    ];

    tableData = tableData
      ? tableData.map((obj) => {
        let test = {};
        Object.keys(obj).forEach(
          (item) => (test[item] = obj[item] ? obj[item] : "-")
        );
        return test;
      })
      : null;

    return (
      <>
        <div className="tab-page-container referrals-tab">
          {this.props.referralError && (
            <Alert color="danger" className="text-center">
              {this.props.referralError}
            </Alert>
          )}
          {tableData ? (
            <>
              <div className="padding-top-15 padding-left-15 margin-bottom-15">
                <Button
                  color="primary"
                  className="text-center"
                  onClick={() => this.togglePcpModal()}
                  disabled={complianceFlag === "COMPLIANT" ? false : true}
                >
                  Add Referral
                </Button>
              </div>
              <div className="maxh-350">
                {this.props.createReferralsFailure ? (
                  <Alert color="danger">
                    {this.props.createReferralsFailure}
                  </Alert>
                ) : (
                    ""
                  )}
                {this.props.createReferralsSuccess ? (
                  <Alert color="success">
                    {this.props.createReferralsSuccess}
                  </Alert>
                ) : (
                    ""
                  )}
                <Grid
                  columns={activatationJson}
                  data={tableData}
                  sortOrder={"asc"}
                  hoverable={false}
                  justified={false}
                  sortable={true}
                  extraClass={"referral-row"}
                  useFixedHeader={false}
                  rowKey={(record) => {
                    return record.memberUuid;
                  }}
                />
              </div>
              <Modal
                isOpen={this.props.openChangePcpModal}
                toggle={this.cancelPcpModal}
                className="modal-pcpname"
              >
                <ModalHeader className="create-referral">
                  <i
                    className="icon icon-close close-modal"
                    onClick={this.cancelPcpModal}
                  />
                  <p className="modal-title-referral">
                    Create a referral for{" "}
                    {this.props.selectedMember &&
                      this.props.selectedMember.name && (
                        <span className="text-capitalize">
                          {this.props.selectedMember.name.toLowerCase()}
                        </span>
                      )}
                  </p>
                  <p className="modal-header-caption">
                    {this.props.workflowRequest
                      ? ""
                      : this.props.referralWorkflow == "Specialty Only"
                        ? "Search by specialty required"
                        : this.props.pcpList && this.props.pcpList.length > 0
                          ? "Select the provider to add a referral"
                          : "Search by NPI or provider details"}
                  </p>
                </ModalHeader>
                <ModalBody>
                  {this.state.isNotNpiName ? (
                    <Alert color="danger">
                      NPI or First Name or Last Name is mandatory field.
                    </Alert>
                  ) : (
                      ""
                    )}
                  {!this.props.pcploading ? (
                    <PcpChangeComponent
                      memberId={this.props.memberId}
                      searchCriteria={this.state.searchCriteria}
                      selectedPcp={this.state.selectedPcp}
                      onChangeHandler={this.onChangeHandler}
                      getSelectedPcpInfo={this.getSelectedPcpInfo}
                      invalidNpiError={this.state.invalidNpi}
                      handleDropDown={this.handleDropDown}
                      handleCheck={this.handleCheck}
                      referralSelected={this.state.referralSelected}
                      hasError={this.state.hasError}
                      handleEnterKeyPress={this.handleEnterKeyPress}
                    />
                  ) : (
                      <Loader />
                    )}
                </ModalBody>
                <ModalFooter className="justify-center">
                  {this.props.workflowRequest ? null : this.props.referrals
                    .referralWorkflow == "Specialty Only" ? null : this.props
                      .pcpList ? (
                        <Button
                          color="primary"
                          onClick={this.searchAgain}
                          disabled={this.props.pcploading ? true : false}
                        >
                          Search Again
                        </Button>
                      ) : (
                        <Button
                          color="primary"
                          disabled={this.props.pcploading ? true : false}
                          onClick={this.findPCPList}
                        >
                          Search
                        </Button>
                      )}
                  <Button
                    color="secondary"
                    onClick={this.cancelPcpModal}
                    disabled={this.props.pcploading ? true : false}
                  >
                    Cancel
                  </Button>
                  {this.props.referrals.referralWorkflow ==
                    "Specialty Only" && (
                      <Button
                        className="btn-add-referral specialty-only"
                        disabled={
                          this.state.searchCriteria.specialty ? false : true
                        }
                        onClick={this.submitReferral}
                      >
                        Add Referral
                      </Button>
                    )}
                  {this.state.referralSelected &&
                    this.props.memberCare.addReferralEnabled ? (
                      <Button
                        className="btn-add-referral"
                        disabled={this.props.pcploading ? true : false}
                        onClick={this.handlePcpUpdate}
                      >
                        Add Referral
                      </Button>
                    ) : null}
                </ModalFooter>
              </Modal>
            </>
          ) : (
              <Loader />
            )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getReferrals: (memberId) => dispatch(getReferrals(memberId)),
    setOpenChangePcpModal: (pcpModalState) =>
      dispatch(setOpenChangePcpModal(pcpModalState)),
    setPcpDetail: (pcpList) => dispatch(setPcpDetail(pcpList)),
    createSubmitReferral: (reqObj) => dispatch(createSubmitReferral(reqObj)),
    searchPcp: (reqObj) => dispatch(searchPcp(reqObj)),
    selectPcpItem: (reqObj) => dispatch(selectPcpItem(reqObj)),
  };
};

function mapStateToProps(state) {
  return {
    referrals: state.referralDetails,
    referralError: state.referralError,
    careDetails: state.memberCare.careDetails,
    callerInfo: state.memberProfile.callerInfo,
    careError: state.memberCare.careError,
    pcpList: state.memberCare.pcpList,
    openChangePcpModal: state.memberCare.openChangePcpModal,
    pcploading: state.memberCare.pcploading,
    createReferralsFailure: state.createReferralsFailure,
    createReferralsSuccess: state.createReferralsSuccess,
    isPcpReferralAvailable: state.isPcpReferralAvailable,
    profile: state.memberProfile.profile,
    referralWorkflow: state.referralDetails.referralWorkflow,
    workflowRequest: state.referralDetails.workflowRequest,
    memberCare: state.memberCare,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Referral);
