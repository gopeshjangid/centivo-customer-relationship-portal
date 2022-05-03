import React, { Component } from "react";
import {
  getCareTabInfo,
  setPcpDetail,
  searchPcp,
  setPcpUpdate,
  setPcpUpdateActivation,
  setOpenChangePcpModal,
  getMemberStatus,
  selectPcpItem,
  getDependentList,
  verifyEligibility,
  getMembersData,
  toggleActivationScreen,
  clearActivationError,
  syncFamilyClaimListStart,
  syncFamilyClaimListReset,
} from "./../../actions";
import PcpChangeComponent from "./pcpChange";
import Table from "@trendmicro/react-table";
import { _global } from "../../helpers/global";
import { connect } from "react-redux";
import { Alert, Button, ModalHeader, Modal, ModalFooter, ModalBody } from "reactstrap";
import { ContactInfo, PlanDetails, FamilyMembers, CommonModal, Selectpcp } from "../activation";
import { Loader } from "./../wrapper";
import "./scss/care.scss";
import { CheckCircleIcon, XCircleAlertIcon } from "../../assets/icons/components";
import ProgressBar from "./ProgressBar";

const gridJson = [
  {
    title: "Information",
    render: (value, row, index) => {
      return row.information;
    },
  },
  {
    title: "Value",
    render: (value, row, index) => {
      return row.value;
    },
  },
];

let tableHeight = null;

/**
 * @name Care
 * @extends Component
 */

class Care extends Component {
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
        pcpFlag: true,
        memberUuid: window.atob(this.props.memberId),
      },
      selectedPcp: null,
      isNotNpiName: false,
      invalidNpi: false,
      referralSelected: "",
      hasError: false,
      activationScreen: "contactInfo",
      email: props.memberInfo.profile.email,
      phone: props.memberInfo.profile.phone,
      selectedMember: {},
      isValid: true,
    };
    this.defaultSearchCriteria = this.state.searchCriteria;

    this.toggleModal = this.toggleModal.bind(this);
    this.togglePcpModal = this.togglePcpModal.bind(this);
    this.getfullName = this.getfullName.bind(this);
    this.findPCPList = this.findPCPList.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.handlePcpUpdate = this.handlePcpUpdate.bind(this);
    this.searchAgain = this.searchAgain.bind(this);
    // let reqObj = {
    //   memberUuid: this.props.memberId
    // }
    // this.props.getCareTabInfo(reqObj);
  }

  componentDidMount() {
    let reqObj = {
      memberUuid: this.props.memberId,
    };
    this.props.getCareTabInfo(reqObj);
  }

  componentWillUnmount() {
    this.props.syncFamilyClaimListReset();
  }

  componentWillReceiveProps = (nextProps) => {
    if (!nextProps.pcpList) {
      if (this.state.pcpnameScreenPopup) {
        this.setState({ pcpnameScreenPopup: false });
      }
    }
    if (nextProps.memberInfo.profile !== this.props.memberInfo.profile) {
      this.setState({
        email: nextProps.memberInfo.profile.email,
        phone: nextProps.memberInfo.profile.phone,
      });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.careDetails) return true;
    if (nextProps.careError) return true;
    if (nextProps.activationError !== this.props.activationError) return true;
    if (this.props.familyMembers !== nextProps.familyMembers) return true;
    return false;
  }

  togglePcpModal = (e) => {
    this.props.setOpenChangePcpModal(!this.props.openChangePcpModal);
    this.props.setPcpDetail(null);
    this.setState({
      invalidNpi: this.props.openChangePcpModal ? !this.props.openChangePcpModal : this.props.openChangePcpModal,
      selectedPcp: null,
      hasError: false,
      searchCriteria: {
        ...this.state.searchCriteria,
        npi: "",
        lastName: "",
        firstName: "",
        distance: "10",
        location: "",
        specialty: "",
        pcpFlag: true,
        memberUuid: window.atob(this.props.memberId),
      },
    });
  };

  getSelectedPcpInfo = (e) => {
    let select = JSON.parse(e.currentTarget.dataset.obj);
    this.setState({ selectedPcp: select });
  };

  findPCPList() {
    let { npi, firstName, lastName, location, distance, specialty } = this.state.searchCriteria;
    this.setState({
      hasError: false,
      invalidNpi: false,
    });
    if ((npi !== "" && !isNaN(npi)) || (lastName !== "" && location !== "" && distance !== "")) {
      this.props.searchPcp(this.state.searchCriteria);
    } else {
      if (isNaN(npi)) {
        this.setState({
          invalidNpi: true,
        });
      } else if (npi == "" && (lastName == "" || location == "" || distance == "")) {
        this.setState({
          hasError: true,
        });
        return false;
      }
    }
  }
  handleCheck = (e) => {
    let select = JSON.parse(e.currentTarget.dataset.obj);
    this.setState({
      referralSelected: select.key,
      selectedPcp: select,
    });
    select.modal = "updatePcp";
    this.props.selectPcpItem(select);
  };

  searchAgain() {
    this.setState({
      referralSelected: false,
      searchCriteria: {
        ...this.state.searchCriteria,
        npi: "",
        lastName: "",
        firstName: "",
        distance: "10",
        location: "",
        specialty: "",
        pcpFlag: true,
      },
    });
    this.props.setPcpDetail(null);
    this.setState({ selectedPcp: false });
  }

  handlePcpUpdate(e) {
    e.preventDefault();
    let requestJson = {
      npi: this.state.selectedPcp.npi,
      key: this.state.selectedPcp.key,
      memberUuid: this.state.searchCriteria.memberUuid,
    };

    this.props.setPcpUpdate(requestJson);
    this.togglePcpModal();
  }

  handlePcpUpdateActivation(e) {
    e.preventDefault();
    let requestJson = {
      npi: this.state.selectedPcp.npi,
      key: this.state.selectedPcp.key,
      memberUuid: this.state.searchCriteria.memberUuid,
      employeeCertificateNumber: this.props.callerInfo.memberId ? this.props.callerInfo.memberId : "",
    };
    this.props.setPcpUpdateActivation(requestJson);

    this.setState({
      searchCriteria: {
        npi: "",
        lastName: "",
        firstName: "",
        distance: "",
        location: "",
        specialty: "",
        pcpFlag: true,
        memberUuid: window.atob(this.props.memberId),
      },
      referralSelected: false,
    });
  }

  updatePcpActivation = (e) => {
    this.props.toggleActivationScreen("common");
    this.handlePcpUpdateActivation(e);
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
          invalidNpi: false,
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

  activateMember = () => {
    this.toggleModal();
  };

  syncMemberData = () => {
    this.props.syncFamilyClaimListStart(this.props.callerInfo.memberId, this.state.searchCriteria.memberUuid);
  };

  toggleModal = (modalType) => {
    this.setState({
      activationScreenPopup: !this.state.activationScreenPopup,
    });
    this.props.toggleActivationScreen("contactInfo");
  };
  cancelModal = (modalType) => {
    if (!this.props.memberInfo.profile.email && !this.props.memberInfo.profile.phone) {
      this.setState({
        email: "",
        phone: "",
      });
    }

    this.setState({
      searchCriteria: { ...this.defaultSearchCriteria },
    });

    this.toggleModal();
    this.props.clearActivationError();
    this.props.getCareTabInfo({ memberUuid: this.props.memberId });
  };

  copyText = (e) => {
    let copyText = e.target.parentNode.previousSibling ? e.target.parentNode.previousSibling : e.target.parentNode.parentNode.previousSibling;
    copyText.select();
    document.execCommand("copy");
  };

  showActivationStatus = (data) => {
    const ActivationButton =
      data && data.activationStatus ? (
        <>
          <div className="activationLabel">{data.activationStatus}</div>
          {data.activationStatus && (
            <Button color="primary" onClick={this.activateMember} disabled={data.activationStatus.toLowerCase() === "completed" ? true : false}>
              Activate
            </Button>
          )}
        </>
      ) : (
        <>
          <div className="activationLabel">Not Started</div>
          <Button color="primary" onClick={this.activateMember}>
            Activate
          </Button>
        </>
      );
    return ActivationButton;
  };

  cancelPcpModal = () => {
    this.props.setOpenChangePcpModal(false);
    this.setState({
      referralSelected: false,
      invalidNpi: false,
      hasError: false,
    });
  };

  getfullName = (fullName) => {
    return (
      <>
        <span>{fullName}</span>{" "}
        <Button color="link" onClick={() => this.togglePcpModal()}>
          Update PCP
        </Button>
      </>
    );
  };

  changeMemberPcpData = (selectedMember) => {
    this.toggleActivationScreen("searchPcp", selectedMember.memberUuid);
    this.setState({ selectedMember });
  };

  toggleActivationScreen = (activationScreen, memberUuid) => {
    const { email, phone } = this.state;

    if (
      !_global.emailTester(email) ||
      !phone ||
      (phone &&
        phone
          .toString()
          .replaceAll(" ", "")
          .replaceAll("-", "")
          .replaceAll(")", "")
          .replaceAll("(", "")
          .trim().length !== 10)
    ) {
      this.setState({ isValid: false });
      return;
    }

    if (activationScreen === "planDetails") {
      if (!!this.props.memberInfo.profile.userName) {
        return this.props.toggleActivationScreen(activationScreen);
      }
      const familyMembers = JSON.parse(sessionStorage.getItem("familyMembers")).filter((member) => member.memberUuid === this.props.memberId)[0];
      let reqObj = {
        memberId: familyMembers.memberId,
        firstName: familyMembers.firstName,
        lastName: familyMembers.lastName,
        dob: this.props.memberInfo.details ? this.props.memberInfo.details.dob : this.props.callerInfo.dob,
        zipCode: this.props.memberInfo.profile.permanentAddress && this.props.memberInfo.profile.permanentAddress.zip,
        emailAddr: this.state.email,
        paperlessConfirmation: false,
        paperlessEOBConfirmation: false,
        phone: {
          phoneNbr: this.state.phone,
          phoneType: "MOBILE",
        },
        memberUuid: window.atob(this.props.memberId),
      };
      this.props.verifyEligibility(reqObj);
    } else if (activationScreen === "familyMembers") {
      let reqObj = {
        employeeCertificateNumber: this.props.callerInfo.memberId ? this.props.callerInfo.memberId : "",
      };

      this.props.getMembersData(reqObj);
    } else if (activationScreen === "searchPcp") {
      this.props.setPcpDetail(null);
      this.props.toggleActivationScreen(activationScreen);
      this.setState({
        referralSelected: "",
        searchCriteria: {
          ...this.state.searchCriteria,
          memberUuid,
        },
      });
    }
  };

  renderModal = () => {
    switch (this.props.activationScreen) {
      case "contactInfo":
        return (
          <ContactInfo
            onToggle={this.cancelModal}
            toggleActivationScreen={this.toggleActivationScreen}
            verifyEligibilityData={this.props.verifyEligibilityData}
            contactChangeHandler={this.contactChangeHandler}
            profile={this.state}
          />
        );

      case "planDetails":
        return <PlanDetails onToggle={this.cancelModal} toggleActivationScreen={this.toggleActivationScreen} />;

      case "familyMembers":
        return (
          <FamilyMembers
            onToggle={this.cancelModal}
            allMembers={this.props.allMembers}
            careDetails={this.props.careDetails}
            changeMemberPcpData={this.changeMemberPcpData}
            memberId={this.props.memberId}
          />
        );
      case "searchPcp":
        return (
          <Selectpcp
            onToggle={this.cancelModal}
            getSelectedPcpInfo={this.getSelectedPcpInfo}
            handleDropDown={this.handleDropDown}
            handleCheck={this.handleCheck}
            pcpSearchAgain={this.searchAgain}
            referralSelected={this.state.referralSelected}
            updatePcpActivation={this.updatePcpActivation}
            memberId={this.props.memberId}
            searchCriteria={this.state.searchCriteria}
            onChangeHandler={this.onChangeHandler}
            selectedMember={this.state.selectedMember}
            invalidNpi={this.state.invalidNpi}
          />
        );

      case "common":
        return <CommonModal onToggle={this.cancelModal}>{this.props.activationError}</CommonModal>;

      default:
        return null;
    }
  };

  contactChangeHandler = ({ target: { name, value } }) => {

    if (name === "email") {
      let email = value.trim();
      this.setState({ email });

      if (_global.emailTester(value)) {
        this.setState({ isValid: true });
      } else {
        this.setState({ isValid: false });
      }
    } else if (name === "phone") {
      let phoneNumber = value
        .replaceAll(" ", "")
        .replaceAll("-", "")
        .replaceAll(")", "")
        .replaceAll("(", "");
      let phone = parseInt(phoneNumber, 10);

      this.setState({ phone: phone });
      if (_global.phoneTester(phone)) {
        this.setState({ isValid: true });
      } else if (isNaN(phone)) {
        this.setState({ isValid: false, phone: "" });
      } else {
        this.setState({ isValid: false });
      }
    }
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  render() {
    let data = this.props.careDetails,
      practiceSummary =
        this.props.careDetails && this.props.careDetails.PcpDetail && this.props.careDetails.PcpDetail.practiceSummary ? this.props.careDetails.PcpDetail.practiceSummary : null,
      providerSummary =
        this.props.careDetails && this.props.careDetails.PcpDetail && this.props.careDetails.PcpDetail.providerSummary ? this.props.careDetails.PcpDetail.providerSummary : null,
      tableData = [],
      fullName;
    if (data) {
      tableData = [
        {
          information: "Activation Status",
          value: this.showActivationStatus(data),
        },
      ];
    }

    if (providerSummary) {
      fullName =
        (providerSummary.providerTitle ? providerSummary.providerTitle + " " : "") +
        (providerSummary.providerFirstName ? providerSummary.providerFirstName + " " : "") +
        (providerSummary.providerLastName ? providerSummary.providerLastName + " " : "");
      fullName = fullName ? fullName.trim() : fullName;

      tableData = [
        ...tableData,
        {
          information: "PCP Name",
          value: this.getfullName(fullName),
        },
      ];
    }

    if (practiceSummary) {
      tableData = [
        ...tableData,
        {
          information: "PCP Practice",
          value: data && practiceSummary && practiceSummary.practiceName,
        },
        {
          information: "PCP Address",
          value:
            data &&
            practiceSummary &&
            practiceSummary.practiceAddress.street +
              ", " +
              practiceSummary.practiceAddress.city +
              ", " +
              practiceSummary.practiceAddress.state +
              ", " +
              practiceSummary.practiceAddress.zip,
        },
        {
          information: "PCP Phone",
          value: data && practiceSummary && practiceSummary.phone,
        },
        {
          information: "Adherence Status",
          value: data && data.adherenceStatus ? data.adherenceStatus : "-",
        },
      ];
    }

    if (data && !data.PcpDetail && data.activationStatus === "COMPLETED") {
      tableData = [
        ...tableData,
        {
          information: "PCP Name",
          value: this.getfullName("-"),
        },
        {
          information: "PCP Practice",
          value: "-",
        },
        {
          information: "PCP Address",
          value: "-",
        },
        {
          information: "PCP Phone",
          value: "-",
        },
        {
          information: "Adherence Status",
          value: data && data.adherenceStatus ? data.adherenceStatus : "-",
        },
      ];
    }

    tableData = [
      ...tableData,
      {
        information: "Claims Activity",
        value: (
          <>
            <div className={this.props.syncFamilyClaimListLoading ? "div-disabled" : "sync-data-btn"} onClick={this.syncMemberData}>
              Sync member's data
            </div>

            {this.props.syncFamilyClaimListLoading && (
              <div className="sync-data-loading">
                <ProgressBar />
                <div>Syncing data...</div>
              </div>
            )}
            {this.props.syncFamilyClaimListSuccess && (
              <div className="sync-data-success">
                <CheckCircleIcon width="20px" height="20px" />
                <div>Syncing member's data complete</div>
              </div>
            )}
            {this.props.syncFamilyClaimListError && (
              <div className="sync-data-error">
                <XCircleAlertIcon width="20px" height="20px" />
                <div>Please try again.</div>
              </div>
            )}
          </>
        ),
      },
    ];
    const statusTableData = [
      {
        information: "Activation Status",
        value: <Button onClick={this.activateMember}>Activate</Button>,
      },
    ];

    return (
      <>
        <div className="tab-page-container member-tab">
          {this.props.careError && (
            <div>
              <Alert color="danger" className="text-center">
                {this.props.careError}
              </Alert>

              <Table
                columns={gridJson}
                data={statusTableData}
                hoverable={false}
                justified={false}
                useFixedHeader={true}
                maxHeight={tableHeight}
                rowKey={(record) => record.memberUuid}
              />
            </div>
          )}
          {!this.props.careError && data ? (
            <Table columns={gridJson} data={tableData} hoverable={false} justified={false} useFixedHeader={true} maxHeight={tableHeight} rowKey={(record) => record.memberUuid} />
          ) : (
            !this.props.careError && <Loader />
          )}
        </div>
        {this.state.activationScreenPopup ? this.renderModal() : null}
        <Modal isOpen={this.props.openChangePcpModal} toggle={this.togglePcpModal} className="modal-pcpname">
          <ModalHeader>
            Find a new PCP for {this.props.callerInfo && this.props.callerInfo.name && <span className="text-capitalize">{this.props.callerInfo.name.toLowerCase()}</span>}
          </ModalHeader>
          <ModalBody>
            {this.state.isNotNpiName ? <Alert color="danger">NPI or Last Name and Location is mandatory field.</Alert> : ""}
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
                modalType="updatePcp"
              />
            ) : (
              <Loader />
            )}
          </ModalBody>
          <ModalFooter className="justify-center">
            {this.props.pcpList ? (
              <Button color="primary" onClick={this.searchAgain} disabled={this.props.pcploading ? true : false}>
                Search Again
              </Button>
            ) : (
              <Button color="primary" disabled={this.props.pcploading ? true : false} onClick={this.findPCPList}>
                Search
              </Button>
            )}
            {this.state.selectedPcp ? (
              <Button color="primary" disabled={this.props.pcploading ? true : false} onClick={this.handlePcpUpdate}>
                Update
              </Button>
            ) : null}
            <Button color="secondary" onClick={this.togglePcpModal} disabled={this.props.pcploading ? true : false}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCareTabInfo: (memberUuid) => dispatch(getCareTabInfo(memberUuid)),
    syncFamilyClaimListStart: (employeeCertificateNumber, memberUuid) => dispatch(syncFamilyClaimListStart({ employeeCertificateNumber, memberUuid })),
    syncFamilyClaimListReset: () => dispatch(syncFamilyClaimListReset()),
    setOpenChangePcpModal: (openChangePcpModal) => dispatch(setOpenChangePcpModal(openChangePcpModal)),
    setPcpDetail: () => dispatch(setPcpDetail()),
    searchPcp: (reqObj) => dispatch(searchPcp(reqObj)),
    getMemberStatus: (reqObj) => dispatch(getMemberStatus(reqObj)),
    selectPcpItem: (reqObj) => dispatch(selectPcpItem(reqObj)),
    getDependentList: (reqObj) => dispatch(getDependentList(reqObj)),
    verifyEligibility: (reqObj) => dispatch(verifyEligibility(reqObj)),
    getMembersData: (reqObj) => dispatch(getMembersData(reqObj)),
    toggleActivationScreen: (reqObj) => dispatch(toggleActivationScreen(reqObj)),
    clearActivationError: () => dispatch(clearActivationError()),
    setPcpUpdate: (reqObj) => dispatch(setPcpUpdate(reqObj)),
    setPcpUpdateActivation: (reqObj) => dispatch(setPcpUpdateActivation(reqObj)),
  };
};

const mapStateToProps = (state) => {
  return {
    careDetails: state.memberCare.careDetails,
    callerInfo: state.memberProfile.callerInfo,
    careError: state.memberCare.careError,
    pcpList: state.memberCare.pcpList,
    openChangePcpModal: state.memberCare.openChangePcpModal,
    pcploading: state.memberCare.pcploading,
    familyMembers: state.memberDependents.details,
    allMembers: state.memberCare.allMembers,
    memberInfo: state.memberProfile,
    verifyEligibilityData: state.memberCare.verifyEligibilityData,
    activationScreen: state.memberCare.activationScreen,
    activationError: state.memberCare.activationError,
    updateError: state.memberCare.updateError,
    syncFamilyClaimListLoading: state.memberCare.syncFamilyClaimListLoading,
    syncFamilyClaimListSuccess: state.memberCare.syncFamilyClaimListSuccess,
    syncFamilyClaimListError: state.memberCare.syncFamilyClaimListError,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Care);
