import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Input, Alert, Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import { updateMemberInfo, updateAddressRequest, resetAccount, toggleAddressModal } from "./../../actions";
import Switch from "react-switch";
import { _global } from "./../../helpers";
import Table from "@trendmicro/react-table";
import UpdateMailingAddress from "./updateMailingAddress";
import { Loader } from "./../wrapper";
import "@trendmicro/react-table/dist/react-table.css";
import "./scss/profile.scss";

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

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phone: "",
      updateEmailFlag: false,
      updatePhoneFlag: false,
      isEmailValid: true,
      isPhoneValid: true,
      toggleAddress: false,
      isZipValid: false,
      address: {
        street1: undefined,
        street2: undefined,
        street3: undefined,
        city: undefined,
        state: undefined,
        zip: undefined,
      },
      counter: 0,
      isAddressValid: false,
      isAddressError: false,
      resetModal: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.toggleAddress !== props.toggleAddress)
      return {
        toggleAddress: props.toggleAddress,
      };
    return null;
  }

  resetAccount = () => {
    this.setState((prevState) => ({
      resetModal: !prevState.resetModal,
    }));
  };

  resetAccountAPICall = () => {
    const memberUuid = this.props.memberId;
    this.setState((prevState) => ({
      resetModal: !prevState.resetModal,
    }));
    this.props.resetAccount(memberUuid);
  };

  updateCommunicationPreference = (memberProfile, that) => {
    return (
      <>
        {
          <div className="communicationRadioBox">
            <div>One of the below must be selected</div>
            <br />
            <div className="communicationRadioDiv">
              <input
                type="radio"
                value="emailonly"
                checked={Boolean(memberProfile.communicationPreference ? memberProfile.communicationPreference.email : false)}
                name="communicationType"
                onChange={() => {}}
                onClick={() => this.handleChange(memberProfile, "emailonly")}
                className="communicationRadioField"
              />{" "}
              <label>Email only/paperless</label>
              <br />
              <div>No proper EOBs or communications but receive all communications in electronic format</div>
            </div>
            <div className="communicationRadioDiv">
              <input
                type="radio"
                value="paperonly"
                checked={Boolean(memberProfile.communicationPreference ? memberProfile.communicationPreference.paper : false)}
                name="communicationType"
                onChange={() => {}}
                onClick={() => this.handleChange(memberProfile, "paperonly")}
                className="communicationRadioField"
              />{" "}
              <label>Paper only for some communications</label>
              <br />
              <div>Limited to EOBs and critical health plan updates only. Some important emails may be sent periodically.</div>
            </div>
            <div className="communicationRadioDiv">
              <input
                type="radio"
                value="both"
                checked={memberProfile.communicationPreference ? memberProfile.communicationPreference.paper && memberProfile.communicationPreference.email : false}
                name="communicationType"
                onChange={() => {}}
                onClick={() => this.handleChange(memberProfile, "both")}
                className="communicationRadioField"
              />
              <label> Both email and paper</label>
              <br />
              <div>Receive all communications in both electronic and paper formats</div>
            </div>
          </div>
        }
        {
          <div>
            <span className="communication-label">SMS :</span>
            {that.makeFieldSwitch(memberProfile, "toggleSmsPreferance")}
          </div>
        }
      </>
    );
  };

  updatePaperlessPreference = (memberProfile, that) => {
    return (
      <div>
        <span className="communication-label"></span>
        {this.makeFieldSwitch(memberProfile, "togglePaperlessPreferance")}
      </div>
    );
  };

  editValue = (e, fieldName) => {
    let memberProfile = this.props.dependentProfileInfo ? this.props.dependentProfileInfo : this.props.profileInfo;
    if (fieldName === "email") {
      this.setState({
        email: memberProfile.email,
        updatePhoneFlag: this.state.phone && memberProfile.phone !== this.state.phone,
        updateEmailFlag: true,
      });
    } else if (fieldName === "phone") {
      this.setState({
        phone: _global.formatPhoneNumberAsNumber(memberProfile.phone),
        updatePhoneFlag: true,
        updateEmailFlag: this.state.email && memberProfile.email !== this.state.email,
      });
    }
  };

  cancelEdit = (e, fieldName, memberProfile) => {
    if (fieldName === "email") {
      this.setState({
        updateEmailFlag: false,
        email: memberProfile.email,
        isEmailValid: true,
      });
    } else if (fieldName === "phone") {
      this.setState({
        updatePhoneFlag: false,
        phone: memberProfile.phone,
        isPhoneValid: true,
      });
    } else {
      this.setState({
        updateEmailFlag: false,
        updatePhoneFlag: false,
        isPhoneValid: true,
        isEmailValid: true,
      });
    }
  };

  updateInput = (e, fieldName) => {
    if (fieldName === "email") {
      let email = e.currentTarget.value.trim();
      this.setState({ email });

      if (_global.emailTester(e.currentTarget.value)) {
        this.setState({ isEmailValid: true });
      } else {
        this.setState({ isEmailValid: false });
      }
    } else if (fieldName === "phone") {
      let phoneNumber = e.currentTarget.value
        .replaceAll(" ", "")
        .replaceAll("-", "")
        .replaceAll(")", "")
        .replaceAll("(", "");
      let phone = parseInt(phoneNumber, 10);

      this.setState({ phone: phone });
      if (_global.phoneTester(phone)) {
        this.setState({ isPhoneValid: true });
      } else if (isNaN(phone)) {
        this.setState({ isPhoneValid: false, phone: "" });
      } else {
        this.setState({ isPhoneValid: false });
      }
    }
  };

  saveUpdatedMemberInfo = (e, memberProfile, fieldName) => {
    e.preventDefault();
    let requestJSON = {
        memberUuid: window.atob(this.props.memberId),
      },
      updateField;

    if (fieldName === "email") {
      if (!this.state.isEmailValid) {
        return false;
      }
      requestJSON = {
        ...requestJSON,
        emailAddr: this.state.email,
      };
      updateField = "email";
      this.setState({ isPhoneValid: true });
    } else if (fieldName === "phone") {
      requestJSON = {
        ...requestJSON,
        phoneNbr: this.state.phone ? this.state.phone.toString() : null,
      };
      updateField = "phone";

      if (!_global.emailTester(this.state.email)) {
        this.setState({ email: memberProfile.email, isEmailValid: true });
      }

      if ((this.state.phone ? this.state.phone.toString().length : null) !== 10) {
        this.setState({ isPhoneValid: false });
        return false;
      }
      if (!this.state.isPhoneValid) {
        return false;
      }
    }

    this.props.updateMemberInfo(requestJSON, updateField);

    this.setState({
      updateEmailFlag: false,
      updatePhoneFlag: false,
    });
  };

  makeFieldEditable = (memberProfile, fieldName) => {
    let fieldValue, updateFlag, updatedValue;

    if (fieldName === "email") {
      fieldValue = this.state.email || memberProfile.email;
      updateFlag = this.state.updateEmailFlag;
      updatedValue = this.state.email;
    } else if (fieldName === "phone") {
      fieldValue = _global.formatPhoneNumberOnProfile(this.state.phone) || _global.formatPhoneNumberOnProfile(memberProfile.phone);
      updateFlag = this.state.updatePhoneFlag;
      updatedValue = _global.formatPhoneNumberOnProfile(this.state.phone);
    }

    return !updateFlag ? (
      <>
        {fieldValue}
        <Button color={fieldValue ? "link" : "primary"} onClick={(e) => this.editValue(e, fieldName)}>
          {fieldValue ? "Edit" : "Add"}
        </Button>
      </>
    ) : (
      <>
        <Form onSubmit={(e) => this.saveUpdatedMemberInfo(e, memberProfile, fieldName)}>
          <Input className="editFieldInputBox" value={updatedValue} onChange={(e) => this.updateInput(e, fieldName)} name={fieldName} />
          <Button color="default" className="button-link" type="submit">
            Save
          </Button>
          <Button color="default" className="button-link" onClick={(e) => this.cancelEdit(e, fieldName, memberProfile)}>
            Cancel
          </Button>
        </Form>
      </>
    );
  };

  makeFieldSwitch = (memberProfile, fieldName) => {
    if (memberProfile && fieldName === "togglePaperlessPreferance") {
      return (
        <Switch
          onChange={() => this.handleChange(memberProfile, "togglePaperlessPreferance")}
          checked={Boolean(memberProfile.communicationPreference ? memberProfile.communicationPreference.paperless : false)}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      );
    }
    if (memberProfile && fieldName === "toggleEmailPreferance") {
      return (
        <Switch
          onChange={() => this.handleChange(memberProfile, "toggleEmailPreferance")}
          checked={memberProfile.communicationPreference ? Boolean(memberProfile.communicationPreference.email) : true}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      );
    }
    if (memberProfile && fieldName === "toggleSmsPreferance") {
      return (
        <Switch
          onChange={() => this.handleChange(memberProfile, "toggleSmsPreferance")}
          checked={memberProfile.communicationPreference ? Boolean(memberProfile.communicationPreference.sms) : true}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      );
    }
  };

  handleChange = (memberProfile, fieldName) => {
    const dependantMemberStatus = Object.keys(this.props.memberFamilyProfile).length ? true : false;
    let requestJSON = {
      dependantMemberStatus: dependantMemberStatus,
      memberUuid: window.atob(this.props.memberId),
      paperless: Boolean(memberProfile.communicationPreference && memberProfile.communicationPreference.paperless),
      email: Boolean(memberProfile.communicationPreference && memberProfile.communicationPreference.email),
      sms: Boolean(memberProfile.communicationPreference && memberProfile.communicationPreference.sms),
      paper: Boolean(memberProfile.communicationPreference && memberProfile.communicationPreference.paper),
    };
    if (fieldName === "emailonly") {
      requestJSON = {
        ...requestJSON,
        email: true,
        paperless: true,
        paper: false,
      };
    } else if (fieldName === "paperonly") {
      requestJSON = {
        ...requestJSON,
        email: false,
        paperless: false,
        paper: true,
      };
    } else if (fieldName === "both") {
      requestJSON = {
        ...requestJSON,
        email: true,
        paperless: false,
        paper: true,
      };
    }

    if (fieldName === "toggleSmsPreferance") {
      requestJSON = {
        ...requestJSON,
        sms: !Boolean(memberProfile.communicationPreference && memberProfile.communicationPreference.sms),
      };
    }

    this.props.updateMemberInfo(requestJSON, fieldName);
  };

  handleToggleAddress = () => {
    this.props.toggleAddressModal();
  };

  updateFieldInfo = (e, fieldName) => {
    let inputData = e.currentTarget.value;

    switch (fieldName) {
      case "street1":
        return this.setState({
          ...this.state,
          address: {
            ...this.state.address,
            street1: inputData,
          },
        });

      case "street2":
        return this.setState({
          ...this.state,
          address: {
            ...this.state.address,
            street2: inputData,
          },
        });

      case "street3":
        return this.setState({
          ...this.state,
          address: {
            ...this.state.address,
            street3: inputData,
          },
        });

      case "city":
        return this.setState({
          ...this.state,
          address: {
            ...this.state.address,
            city: inputData,
          },
        });

      case "state":
        return this.setState({
          ...this.state,
          address: {
            ...this.state.address,
            state: inputData,
          },
        });

      case "zip":
        if (parseInt(inputData) !== NaN) {
          return this.setState({
            ...this.state,
            address: {
              ...this.state.address,
              zip: inputData,
            },
          });
        }
        break;

      default:
        return this.state;
    }
  };

  handleAddressUpdate = (values) => {
    let { street1, street2 = "", street3 = "", city, state, zip } = values;

    if (street1 === "" && street2 === "" && street3 === "" && city === "" && state === "" && zip === "") {
      this.setState({ isAddressValid: true });
      setTimeout(() => this.setState({ isAddressValid: false }), 5000);
      return false;
    }

    if (!_global.zipTester(zip)) {
      this.setState({ isZipValid: true });
      setTimeout(() => this.setState({ isZipValid: false }), 5000);
      return false;
    }

    let requestJSON = {
      street1,
      street2,
      street3,
      city,
      state,
      zip,
      memberUuid: window.atob(this.props.memberId),
    };

    this.props.updateAddressRequest(requestJSON);
  };

  componentDidMount = () => {
    if (this.props.profileInfo.communicationPreference && this.props.profileInfo.communicationPreference.email) {
      this.setState({
        communicationPreferenceEmail: this.props.profileInfo.communicationPreference.email,
      });
    }
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  render() {
    const dependent = this.props.dependentProfileInfo;
    let memberProfile;
    if (dependent) {
      memberProfile = this.props.dependentProfileInfo;
    } else {
      memberProfile = this.props.profileInfo;
    }
    const loading = this.props.loading;
    let data = [];
    if (this.props.profileInfo) {
      let primaryAddress = memberProfile.primaryAddress ? (
        <>
          <span>
            {(memberProfile.primaryAddress.street1 ? memberProfile.primaryAddress.street1 + ", " : "") +
              (memberProfile.primaryAddress.street2 ? memberProfile.primaryAddress.street2 + ", " : "") +
              (memberProfile.primaryAddress.street3 ? memberProfile.primaryAddress.street3 + ", " : "") +
              (memberProfile.primaryAddress.city ? memberProfile.primaryAddress.city + ", " : "") +
              (memberProfile.primaryAddress.state ? memberProfile.primaryAddress.state + ", " : "") +
              (memberProfile.primaryAddress.zip ? memberProfile.primaryAddress.zip : "")}{" "}
          </span>{" "}
          {this.props.memberInfo && this.props.memberInfo.isDependentType && `${this.props.memberInfo.isDependentType}`.toLowerCase() === "subscriber" && (
            <Button color={"link"} onClick={this.handleToggleAddress}>
              Edit
            </Button>
          )}{" "}
        </>
      ) : (
        this.props.memberInfo &&
        this.props.memberInfo.isDependentType &&
        `${this.props.memberInfo.isDependentType}`.toLowerCase() === "subscriber" && (
          <Button color={"primary"} onClick={this.handleToggleAddress}>
            {" "}
            Add
          </Button>
        )
      );

      let permanentAddress = memberProfile.permanentAddress
        ? memberProfile.permanentAddress.street1 +
          ", " +
          (memberProfile.permanentAddress.street2 ? memberProfile.permanentAddress.street2 + ", " : "") +
          (memberProfile.permanentAddress.street3 ? memberProfile.permanentAddress.street3 + ", " : "") +
          memberProfile.permanentAddress.city +
          ", " +
          memberProfile.permanentAddress.state +
          ", " +
          memberProfile.permanentAddress.zip
        : "-";

      data = [
        {
          information: "Username",
          value: memberProfile.userName ? (
            <>
              <span>{memberProfile.userName}</span>
              {
                <Button color="link" onClick={this.resetAccount}>
                  Reset Account
                </Button>
              }
            </>
          ) : (
            "-"
          ),
        },
        {
          information: "Email",
          value: this.makeFieldEditable(memberProfile, "email"),
        },
        {
          information: "Phone",
          value: this.makeFieldEditable(memberProfile, "phone"),
        },
        {
          information: "Permanent Address",
          value: permanentAddress,
        },
        {
          information: "Mailing Address",
          value: primaryAddress ? primaryAddress : "-",
        },
        {
          information: "Communication Preference",
          value:
            memberProfile && memberProfile.communicationPreference
              ? this.updateCommunicationPreference(memberProfile, this)
              : this.updateCommunicationPreference(memberProfile, this),
        },
        //  {
        //    information: 'Paperless',
        //    value: ''
        //  },
        {
          information: "Last Login",
          value: memberProfile.lastLogin ? _global.formatDateString(memberProfile.lastLogin) : "-",
        },
        {
          information: "Avg. Monthly Login",
          value: memberProfile.avgMonthlyLogin ? memberProfile.avgMonthlyLogin : "-",
        },
        {
          information: "Risk Tier",
          value: memberProfile.riskTier ? memberProfile.riskTier : "-",
        },
        {
          information: "User Segment",
          value: memberProfile.userSegment ? memberProfile.userSegment : "-",
        },
      ];
    }

    data = data.filter((object) => {
      if (
        object.information !== "Communication Preference" &&
        object.information !== "Email" &&
        object.information !== "Permanent Address" &&
        object.information !== "Mailing Address" &&
        object.information !== "Phone" &&
        object.information !== "Paperless" &&
        object.information !== "Username"
      ) {
        return object.value !== "-" && object.value.trim() !== "";
      } else {
        return object;
      }
    });
    return this.props.profileInfo && !loading ? (
      <div className="tab-page-container member-tab">
        {!this.state.isEmailValid ? <Alert color="danger"> Email is not valid. </Alert> : ""}
        {!this.state.isPhoneValid ? <Alert color="danger"> Phone number is not valid. </Alert> : ""}
        {!this.props.isFieldUpdated && !this.props.updateResponse && <Alert color="danger"> Records are updated ! </Alert>}
        {this.props.updateResponse && <Alert color="danger">{this.props.updateResponse} </Alert>}
        {this.props.isFieldError && <Alert color="danger">{this.props.isFieldError} </Alert>}
        {this.props.isResetSuccessMsg && <Alert color="success">{"Profile Reset Successfully"}</Alert>}

        <Table
          columns={gridJson}
          data={data}
          bordered={true}
          hoverable={false}
          justified={false}
          rowKey={(record) => record.memberUuid}
          useFixedHeader={true}
          maxHeight={tableHeight}
          rowClassName={() => "table-row"}
          emptyText={() => "No data found"}
        />

        {this.props.toggleAddress && (
          <Modal isOpen={this.props.toggleAddress} toggle={this.handleToggleAddress} className="modal-address">
            <ModalHeader>
              Update mailing address for <span className="text-capitalize strong">{this.props.memberDetail.name.toLowerCase()}</span>
              <Button color="default" className="btn-close" onClick={this.handleToggleAddress}>
                <i className="icon icon-close"></i>
              </Button>
            </ModalHeader>
            <ModalBody>
              {this.state.isAddressValid ? <Alert color="danger">All field are blank, please fill the input.</Alert> : ""}
              {this.state.isZipValid ? <Alert color="danger">Zip code allows five-digit or nine-digit (called ZIP+4) formats</Alert> : ""}
              {this.props.updateAddressFail ? <Alert color="danger"> {this.props.updateAddressFail} </Alert> : ""}
              <UpdateMailingAddress
                initialValues={this.props.profileInfo && this.props.profileInfo.primaryAddress}
                handleAddressUpdate={this.handleAddressUpdate}
                handleToggleAddress={this.handleToggleAddress}
              />
            </ModalBody>
          </Modal>
        )}

        <Modal isOpen={this.state.resetModal} fade={false} toggle={this.resetAccount} className="modal-reset-body modal-address">
          <ModalHeader toggle={this.resetAccount}>Reset Account</ModalHeader>
          <ModalBody>Are you sure want to reset your account?</ModalBody>
          <ModalFooter>
            <Button color="default" className="button button-primary" onClick={this.resetAccountAPICall}>
              Yes
            </Button>{" "}
            <Button color="secondary" className="button custom-round-btn" onClick={this.resetAccount}>
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    ) : (
      <Loader />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateAddressRequest: (reqObj) => dispatch(updateAddressRequest(reqObj)),
  updateMemberInfo: (reqObj) => dispatch(updateMemberInfo(reqObj)),
  resetAccount: (memberId) => dispatch(resetAccount(memberId)),
  toggleAddressModal: (bool) => dispatch(toggleAddressModal(bool)),
});

function mapStateToProps(state) {
  return {
    updateSuccessMsg: state.memberProfile.memberInfo.updateAddressSuccess,
    updateAddressFail: state.memberProfile.memberInfo.updateAddressFail,
    updateResponse: state.memberProfile.memberInfo.respMsg,
    isFieldUpdated: state.memberProfile.memberInfo.isFieldUpdated,
    isFieldError: state.memberProfile.memberInfo.isFieldError,
    profileInfo: state.memberProfile.profile,
    loading: state.memberProfile.loading,
    memberInfo: state.memberProfile.memberInfo,
    isResetSuccessMsg: state.memberProfile.isResetSuccessMsg,
    memberDetail: state.memberProfile.memberDetail,
    mailingAddress: state.updateMailingAddress,
    toggleAddress: state.updateMailingAddress.toggleAddress,
    dependentProfileInfo: state.memberFamilyProfile.profile,
    memberFamilyProfile: state.memberFamilyProfile,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
