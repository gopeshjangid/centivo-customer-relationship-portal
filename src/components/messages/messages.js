import React, { Component } from "react";
import classnames from "classnames";
import {
  getMessageTabInfo,
  getMemberInboxMessages,
  getMemberCompleteMessagesInfo,
  replyMemberMessage,
  createNewMessage,
  updateMemberMessages,
  downloadAttachment,
} from "./../../actions";
import Grid from "./../Grid";
import { connect } from "react-redux";
import { Alert } from "reactstrap";
import ReactHtmlParser from "react-html-parser";
import ModalDialog from "../../components/modal-dialog/modalDialog";
import { _global } from "./../../helpers/global";

import { MessageTable } from "./../../components/messageList";
// import MultiSelectInput from '../../components/multiSelectInput/multiSelectInput';
import { Nav, NavItem, NavLink, TabPane, TabContent, Form, FormGroup, Label, Input } from "reactstrap";
import { Loader } from "./../wrapper";
import moment from "moment";

import "./scss/messages.scss";

let tableHeight = null;
/**
 * @name Messages
 * @extends Component
 */
class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      memberUuid: window.atob(this.props.memberId),
      expandedRowKeysArray: [],
      expandedRowKeysArrayForInbox: [],
      activeTab: "inbox",
      inboxMessageUuid: null,
      messageUuid: null,
      expandedDataType: null,
      emailList: [],
      modalState: {
        forwardEmailModal: false,
        confirmResendModal: false,
      },
      emailSubject: "",
      emailBody: "",
      reqParam: null,
      dialogInfo: {
        title: "",
        body: "",
        modalState: false,
      },
    };

    const reqParam = {
      messageFolder: "inbox",
      memberUuid: this.state.memberUuid,
    };

    this.props.getMemberInboxMessages(reqParam);
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.replyMessageSuccess) {
      return {
        modalState: {
          forwardEmailModal: false,
        },
      };
    }
    return null;
  }

  /**
   * toggle tabs inside message tab window.
   * @param {string} tab
   */
  toggleTabs = (tab) => {
    if (tab === "outbox") {
      const reqParam = {
        memberUuid: this.state.memberUuid,
      };
      this.props.getMessageTabInfo(reqParam);
    }

    if (tab === "inbox") {
      const reqParam = {
        messageFolder: "inbox",
        memberUuid: this.state.memberUuid,
      };
      this.props.getMemberInboxMessages(reqParam);
    }

    if (tab === "complete") {
      const reqParam = {
        messageFolder: "complete",
        memberUuid: this.state.memberUuid,
      };
      this.props.getMemberCompleteMessagesInfo(reqParam);
    }

    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  openForwardEmailPopup = (messageData) => {
    const { newMessage, emailSubject, emailId, messageUuid, fullName } = messageData;
    this.setState({
      modalState: {
        forwardEmailModal: true,
      },
      emailSubject,
      emailBody: "",
      emailId,
      messageUuid,
      fullName,
      newMessage,
    });
  };

  openResendEmailPopup = (emailObj, criteriaObj, memberUuid, sensitivity) => {
    this.setState({
      modalState: {
        confirmResendModal: true,
      },
    });

    let requestParam = null;

    if (criteriaObj) {
      requestParam = {
        email: {
          template: emailObj.template,
        },
        criteria: criteriaObj,
        sensitive: sensitivity,
      };
    } else {
      requestParam = {
        email: {
          template: emailObj.template,
        },
        memberUuids: [memberUuid],
        sensitive: sensitivity,
      };
    }

    this.setState({
      reqParam: requestParam,
    });
  };

  resendEmail = () => {};

  cancalResend = () => {
    this.setState({
      modalState: {
        confirmResendModal: false,
      },
    });
  };

  displayAttachmentsIcon = (children) => {
    // console.log(children.files);
    // console.log(children.component);
    this.setState({
      files: children.files,
      filesDisplay: children.component,
    });
  };

  displayAttachmentsError = (children) => {
    this.setState({
      filesUploadErrorDisplay: children,
    });
  };

  forwardEmail = (e) => {
    e.preventDefault();
    const { modalState } = this.state;

    if (this.state.emailBody && this.state.emailBody.length >= 20) {
      let reqObj = {
        memberUuid: this.state.memberUuid,
        message: this.state.emailBody,
      };

      if (this.state.files) {
        reqObj.files = this.state.files;
      }

      if (this.state.newMessage) {
        reqObj.subject = this.state.emailSubject;

        this.props.createNewMessage(reqObj);
        // console.log('clear the state here')
        this.setState({
          emailBody: "",
          emailSubject: "",
          files: null,
          filesDisplay: null,
          filesUploadErrorDisplay: null,
          modalState: {
            forwardEmailModal: false,
          },
        });
      } else {
        reqObj.subject = this.state.emailSubject;
        reqObj.messageId = modalState.messageUuid;
        //console.log(reqObj)
        this.props.replyMemberMessage(reqObj);
        this.setState({
          emailBody: "",
          emailSubject: "",
          files: null,
          filesDisplay: null,
          filesUploadErrorDisplay: null,
        });
      }
      return 'success';
    } else {
      this.setState({
        characterRequired: "Minimum 20 character are required.",
      });

      let that = this;
      setTimeout(() => {
        that.setState({
          characterRequired: null,
        });
      }, 5000);
      return 'failed';
    }
  };

  toggleModal = (modalType) => {
    this.setState({
      modalState: {
        forwardEmailModal: modalType === "forwardEmailModal" ? !this.state.modalState.forwardEmailModal : this.state.modalState.forwardEmailModal,
        confirmResendModal: modalType === "confirmResendModal" ? !this.state.modalState.confirmResendModal : this.state.modalState.confirmResendModal,
      },
      dialogInfo: {
        modalState: false,
      },
    });
  };

  moveMessage = (record) => {
    this.setState({
      memberUuidComplete: record.memberUuid,
    });
    let reqObj;
    if (this.state.activeTab == "inbox") {
      reqObj = {
        messageId: record.messageId,
        //completeStatus: true,
        replyRequired: false,
        completed: true,
        memberUuid: record.recipientId,
      };
    } else if (this.state.activeTab == "complete") {
      reqObj = {
        messageId: record.messageId,
        //completeStatus: false,
        replyRequired: true,
        completed: false,
        memberUuid: record.recipientId,
      };
    }

    this.props.updateMemberMessages(reqObj);
  };

  handleExpandedRowRenderForInbox = (record, key) => {
    return (
      <>
        <div className="email-wrapper">
          <div className="email-body cursor-text">
            {ReactHtmlParser(record.message && record.message.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}
          </div>
          <div className="email-footer">
            <div className="left-align">
              <button
                className="btn btn-transparent btn-reply"
                onClick={() => {
                  this.openForwardEmailPopup({
                    newMessage: false,
                    emailSubject: record.subject,
                    emailId: record.email,
                    messageUuid: record.messageId,
                    fullName: _global.formatCapitalization(`${record.recipientFirstName} ${record.recipientLastName}`),
                    // record.messageText,
                  });
                }}
              >
                <span className="icon icon-corner-up-left" />
                REPLY
              </button>
              <button onClick={() => _global.getText(record)} className="copy-to-clipboard">
                <i className="icon icon-copy-to-clipboard" />
                Copy to Clipboard
              </button>
            </div>

            <div className="right-align">
              <div className="move-message-container" onClick={() => this.moveMessage(record)}>
                <input type="checkbox" className="move-message-checkbox" />
                <i className={`icon icon-circle icon-circle-unchecked`} />
                <label className="move-message-label">Move to {this.state.activeTab === "complete" ? "inbox" : "complete"}</label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  /**
   * On click of message type, showcase the corresponding information inline using
   * table library inbuild functionality
   * @param {object} record
   * @param {string} key
   * @returns {html}
   */
  handleExpandedRowRender1 = (record, key) => {
    return (
      <>
        {this.state.expandedDataType === "email" ? (
          <div className="email-wrapper">
            <div className="email-header">
              <div className="left-align">
                <i className="fa fa-envelope" />
                <span>{record.email.templateName}</span>
              </div>
              <div className="criteria-wrapper">
                {record.criteria ? (
                  <>
                    <Label>
                      <b>Selected Criteria: </b>
                    </Label>
                    <FormGroup className="selectCriteriaList messageList">
                      {record.criteria.tier && record.criteria.tier.allMembersFlag ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check>
                              <Label check>
                                <Input type="checkbox" checked={true} readOnly />
                                All Members
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.gender ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.gender.maleFlag} readOnly />
                                Male
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.gender.maleFlag} readOnly />
                                Female
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.ageGroup ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.ageGroup.youngAdultFlag} readOnly />
                                18-35
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.ageGroup.middleAgeAdultFlag} readOnly />
                                36-50
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.ageGroup.olderAdultFlag} readOnly />
                                50+
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.tier ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.tier.employeeFlag} readOnly />
                                Employee
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.tier.employeeWithSpouseFlag} readOnly />
                                Employee With Spouse
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.tier.employeeWithChildrenFlag} readOnly />
                                Employee With Children
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.tier.employeeWithFamilyFlag} readOnly />
                                Employee With Family
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.activation ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.activation.activationNotStarted} readOnly />
                                Activation Not Started
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.activation.activationIncomplete} readOnly />
                                Activation Incomplete
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.activation.activationCompleted} readOnly />
                                Activation Complete
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.dependentFilter ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.dependentFilter.spouseFlag} readOnly />
                                Spouse
                              </Label>
                            </FormGroup>
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.dependentFilter.adultDependentFlag} readOnly />
                                Adult
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.planList ? (
                        <FormGroup>
                          <div className="inline-radio">
                            {record.criteria.planList.map((planListItem) => (
                              <FormGroup check inline>
                                <Label check>
                                  <Input type="checkbox" checked="true" readOnly />
                                  {planListItem}
                                </Label>
                              </FormGroup>
                            ))}
                          </div>
                        </FormGroup>
                      ) : null}
                      {record.criteria.duplicatesAllowed ? (
                        <FormGroup>
                          <div className="inline-radio">
                            <FormGroup check inline>
                              <Label check>
                                <Input type="checkbox" checked={record.criteria.duplicatesAllowed} readOnly />
                                Duplicate Allowed
                              </Label>
                            </FormGroup>
                          </div>
                        </FormGroup>
                      ) : null}
                    </FormGroup>
                  </>
                ) : (
                  <div>{record.email.emailAddress}</div>
                )}
              </div>
            </div>
            <div className="email-body cursor-text">
              {ReactHtmlParser(record.email.templateDescription.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}
            </div>
          </div>
        ) : null}
        {this.state.expandedDataType === "sms" ? (
          <div className="email-wrapper">
            <div className="email-header">
              <div className="left-align">
                <i className="fa fa-phone-square" />
                <span>SMS</span>
              </div>
            </div>
            <div className="email-body">{ReactHtmlParser(record.sms.smsMessage.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}</div>
          </div>
        ) : null}
        {this.state.expandedDataType === "app" ? (
          <div className="email-wrapper">
            <div className="email-header">
              <div className="left-align">
                <i className="fa fa-comments" />
                <span>{record.inApp.msgSubject}</span>
              </div>
            </div>
            <div className="email-body">{ReactHtmlParser(record.inApp.msgText.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}</div>
          </div>
        ) : null}
      </>
    );
  };

  handleExpandedRowRender = (record, key) => {
    return (
      <>
        <div className="email-wrapper outbox ">
          <div className="replied-anchor outbox-replied-msg">
            1 Reply | {record.createdTimestamp !== "-" ? <span className="clockIcon"> {record.createdTimestamp}</span> : null}
          </div>
          <div className="email-body cursor-text">
            {ReactHtmlParser(record.msgText && record.msgText.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>"))}
            {/* {ReactHtmlParser(record.msgText)} */}
          </div>
        </div>
      </>
    );
  };

  /**
   * render all possible message type in the single table cell.
   * @param {object} record
   * @param {string} text
   * @returns {html}
   */
  expandMessageInfo = (text, record) => {
    return (
      <>
        {record.email ? (
          <div
            className={this.state.expandedDataType === "email" && this.state.messageUuid === record.messageId ? "ulOnHover highlighted" : "ulOnHover"}
            onClick={this.handleClickRow(record, "email")}
          >
            {record.email.templateName ? "EMAIL : " + record.email.templateName : null}
          </div>
        ) : null}
        {record.sms ? (
          <div
            className={this.state.expandedDataType === "sms" && this.state.messageUuid === record.messageId ? "ulOnHover highlighted" : "ulOnHover"}
            onClick={this.handleClickRow(record, "sms")}
          >
            {record.sms.message ? "SMS : " + record.sms.message : null}
          </div>
        ) : null}
        {record.inApp ? (
          <div
            className={this.state.expandedDataType === "app" && this.state.messageUuid === record.messageId ? "ulOnHover highlighted" : "ulOnHover"}
            onClick={this.handleClickRow(record, "app")}
          >
            {record.inApp.msgText ? "IN APP : " + record.inApp.msgText : null}
          </div>
        ) : null}
      </>
    );
  };

  expandMessageInfoForInbox = (text, record) => {
    return (
      <>
        <div onClick={this.handleClickRowForInbox(record)}>
          {record.message ? ReactHtmlParser(record.message && record.message.replace(/{{break}}/g, "<br />").replace(/\*\*(\S(.*?\S)?)\*\*/gm, "<strong>$1</strong>")) : null}
        </div>
      </>
    );
  };

  handleClickRowForInbox = (record) => {
    if (record.messageId !== this.state.inboxMessageUuid) {
      // this.setState(
      //   {
      //     expandedRowKeysArrayForInbox: [],
      //     inboxMessageUuid: record.messageId
      //   },
      //function () {
      this.showRelatedInfoInbox(record);
      //}
      //);
    }
  };

  handleClickRowForComplete = (record) => {
    if (record.messageId !== this.state.completeMessageUuid) {
      this.showRelatedInfoComplete(record);
      // this.setState(
      //   {
      //     expandedRowKeysArrayForComplete: [],
      //     completeMessageUuid: record.messageId
      //   },
      //   function () {
      //     this.showRelatedInfoComplete(record);
      //   }
      // );
    }
  };

  handleClickRowForOutbox = (record) => {
    if (record.messageId !== this.state.outboxMessageUuid) {
      this.showRelatedInfoOutbox(record);
      //   this.setState(
      //     {
      //       expandedRowKeysArrayForOutbox : [],
      //       outboxMessageUuid: record.messageId
      //     },
      //     function () {
      //       this.showRelatedInfoOutbox(record);
      //     }
      //     );
      //   }
    }
  };

  /**
   * set message id of the clicked message.
   * @param {object} record
   * @param {string} datatype
   */
  handleClickRow = (record, datatype) => (e) => {
    this.setState({ expandedRowKeysArray: [], messageUuid: record.messageId }, function() {
      this.showRelatedInfo(record, datatype);
    });
  };

  showRelatedInfoInbox = (record) => {
    this.setState({ expandedRowKeysArrayForInbox: [record.messageId], inboxMessageUuid: record.messageId });
  };

  showRelatedInfoComplete = (record) => {
    this.setState({ expandedRowKeysArrayForComplete: [record.messageId], completeMessageUuid: record.messageId });
  };

  showRelatedInfoOutbox = (record) => {
    this.setState({ expandedRowKeysArrayForOutbox: [record.messageId], outboxMessageUuid: record.messageId });
  };

  /**
   * set realted info of the clicked message using table
   * libraries inbuild functionality.
   * @param {object} record
   * @param {string} datatype
   */
  showRelatedInfo = (record, datatype) => {
    this.setState({
      messageUuid: record.messageId,
      expandedRowKeysArray: [record.messageId],
      expandedDataType: datatype,
    });
  };

  filterDatabyMemberID = (outBoxTableData) => {
    if (outBoxTableData.recipientId === this.state.memberUuid) {
      return outBoxTableData;
    }
  };

  /**
   * redirect to new message page
   * @param {null}
   * @return {redirect the page}
   */
  goToNewMessage = () => {
    this.props.history.push("/new-message#" + sessionStorage.getItem("param"));
  };

  /**
   * redirect to member search page
   * @param {object} memberUuid
   */
  redirectToMemberPage = (memberUuid) => {
    this.props.history.push("/member-details/" + window.btoa(memberUuid) + "#" + sessionStorage.getItem("param"));
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  formatCapitalization = (text) => {
    let arr = text.split(" ");
    return arr.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()).join(" ");
  };

  onDragStart = (ev, id) => {
    ev.dataTransfer.setData("id", ev.target.id);
  };

  onDragOver = (ev) => {
    ev.preventDefault();
  };
  onDrop = (ev, cat) => {
    let id, reqObj;
    if (cat === "complete") {
      id = ev.dataTransfer.getData("id");
      reqObj = {
        memberUuid: this.state.memberUuid,
        messageId: id,
        //completeStatus: true
        replyRequired: false,
        completed: true,
      };
      // this.props.updateMemberMessages(reqObj);
    } else if (cat === "inbox") {
      id = ev.dataTransfer.getData("id");
      reqObj = {
        memberUuid: this.state.memberUuid,
        messageId: id,
        //completeStatus: false
        replyRequired: true,
        completed: false,
      };
      this.props.updateMemberMessages(reqObj);
    }
  };

  hideAccordion = () => {
    if (this.state.activeTab == "inbox") {
      this.setState({
        expandedRowKeysArrayForInbox: null,
        inboxMessageUuid: null,
      });
    } else if (this.state.activeTab == "complete") {
      this.setState({
        expandedRowKeysArrayForComplete: null,
        completeMessageUuid: null,
      });
    } else if (this.state.activeTab == "outbox") {
      this.setState({
        expandedRowKeysArrayForOutbox: null,
        outboxMessageUuid: null,
      });
    }
  };

  modalForReplyMsg = (record) => {
    const { memberUuid, messageId, subject, recipientFirstName, recipientLastName, recipientId } = record;
    const fullName = _global.formatCapitalization(`${recipientFirstName} ${recipientLastName}`);
    this.setState({
      modalState: {
        forwardEmailModal: true,
        memberUuid: recipientId,
        messageUuid: messageId,
      },
      emailSubject: subject,
      emailBody: "",
      fullName,
    });
  };

  handleColumnData = (data) => <div onClick={this.hideAccordion}>{data}</div>;

  handleChange = (e) => this.setState({ emailSubject: e.target.value });

  render() {
    let outBoxTableData = this.props.messageDetails,
      inboxData = this.props.inboxMessageDetails && this.props.inboxMessageDetails.messages ? this.props.inboxMessageDetails.messages : this.props.inboxMessageDetails,
      completeData =
        this.props.completeMessageDetails && this.props.completeMessageDetails.messages ? this.props.completeMessageDetails.messages : this.props.completeMessageDetails;

    inboxData = inboxData
      ? inboxData.map((item) => {
          return {
            ...item,
            createTimestamp: item.createTimestamp ? moment(new Date(parseInt(item.createTimestamp))).format("L") : "-",
            resolvedTimestamp: item.resolvedTimestamp ? moment(new Date(parseInt(item.resolvedTimestamp))).format("L") : "-",
            memberName: item.memberName ? item.memberName : "-",
            memberEmail: item.memberEmail ? item.memberEmail : "-",
            memberPhone: item.memberPhone ? item.memberPhone : "-",
          };
        })
      : null;

    completeData = completeData
      ? completeData.map((item) => {
          return {
            ...item,
            createTimestamp: item.createTimestamp ? moment(new Date(parseInt(item.createTimestamp))).format("L") : "-",
            resolvedTimestamp: item.resolvedTimestamp ? moment(new Date(parseInt(item.resolvedTimestamp))).format("L") : "-",
            memberName: item.memberName ? item.memberName : "-",
            memberEmail: item.memberEmail ? item.memberEmail : "-",
            memberPhone: item.memberPhone ? item.memberPhone : "-",
          };
        })
      : null;

    outBoxTableData = outBoxTableData
      ? outBoxTableData.map((item) => {
          return {
            ...item,
            sensitive: item.sensitive ? <span className="badge badge-danger">true</span> : <span className="badge badge-success">false</span>,
            sensitivityFlag: item.sensitive ? true : false,
            createdTimestamp: item.createdTimestamp ? item.createdTimestamp : "0",
            readTimestamp: item.readTimestamp ? moment(new Date(parseInt(item.readTimestamp))).format("L") : "-",
            sms: item.sms
              ? {
                  message: item.sms.message ? item.sms.message : null,
                  phoneNbr: item.sms.phoneNbr ? _global.formatPhoneNumber(item.sms.phoneNbr) : "-",
                  dateTimeSent: item.sms.dateTimeSent ? moment(new Date(parseInt(item.sms.dateTimeSent))).format("L") : "-",
                }
              : null,
            email: item.email
              ? {
                  ...item.email,
                  dateTimeSent: item.email.dateTimeSent ? moment(new Date(parseInt(item.email.dateTimeSent))).format("L") : "-",
                }
              : null,
            inApp: item.inApp
              ? {
                  ...item.inApp,
                  startDate: item.inApp.startDate ? moment(new Date(parseInt(item.inApp.startDate))).format("L") : "-",
                  endDate: item.inApp.endDate ? moment(new Date(parseInt(item.inApp.endDate))).format("L") : "-",
                }
              : null,
            memberName: item.memberName ? <span onClick={() => this.redirectToMemberPage(item.memberUuid)}>{item.memberName}</span> : null,
          };
        })
      : null;

    outBoxTableData = outBoxTableData && outBoxTableData.filter(this.filterDatabyMemberID);

    return (
      <React.Fragment>
        {this.props.marked && <Loader />}

        <div className="d-flex justify-content-between my-3">
          <button
            type="button"
            color="info"
            className="custom-round-btn btn btn-info"
            onClick={() => {
              this.openForwardEmailPopup({
                newMessage: true,
                emailSubject: "Subject",
                emailId: "",
                fullName: this.props.recipientDetails ? _global.formatCapitalization(this.props.recipientDetails.name) : null,
              });
            }}
          >
            <i className="icon icon-mail" />
            New Message{" "}
          </button>
        </div>
        <MessageTable
          inboxData={inboxData}
          memberMessageFlag={true}
          memberUuid={this.state.memberUuid}
          completeData={completeData}
          outBoxTableData={outBoxTableData}
          getMemberCompleteMessages={this.props.getMemberCompleteMessagesInfo}
          getInboxMessages={this.props.getMemberInboxMessages}
          getMemberOutboxMessages={this.props.getMessageTabInfo}
          modalForReplyMsg={this.modalForReplyMsg}
          updateMessages={this.props.updateMemberMessages}
          downloadAttachment={this.props.downloadAttachment}
        />

        <ModalDialog
          title="In-App Message"
          className='message-dialog'
          showModal={this.state.modalState.forwardEmailModal}
          onToggle={() => this.toggleModal("forwardEmailModal")}
          footerBtns={[
            {
              key: "send",
              text: "Send",
              onclick: this.forwardEmail,
              className: "custom-round-btn btn btn-info",
              icon: "icon icon-send",
            },
          ]}
          footerBtnsAttachement
          displayAttachmentsIcon={this.displayAttachmentsIcon}
          displayAttachmentsError={this.displayAttachmentsError}
        >
          <Form>
            {this.state.characterRequired && <Alert color="danger">{this.state.characterRequired}</Alert>}
            <FormGroup>
              <Label for="exampleEmail">To</Label>
              <Input
                type="email"
                name="emailId"
                id="emailId"
                value={this.state.fullName}
                onChange={(_emails) => {
                  this.setState({ emailList: _emails });
                }}
                readOnly
              />
            </FormGroup>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input
                type="text"
                name="subject"
                id="subject"
                placeholder="Subject"
                value={this.state.emailSubject}
                readOnly={!this.state.newMessage}
                onChange={this.state.newMessage ? this.handleChange : null}
              />
            </FormGroup>

            {/* Display the attached files */}
            {this.state.filesUploadErrorDisplay && this.state.filesUploadErrorDisplay}
            {this.state.filesDisplay && this.state.filesDisplay}

            <FormGroup>
              <Label for="message">Message</Label>
              <Input
                type="textarea"
                name="message"
                id="message"
                placeholder="Message"
                value={this.state.emailBody}
                onChange={(e) => this.setState({ emailBody: e.target.value })}
              />
              <div className="isDragActiveOverlay">
                <div className="title">Drop files here</div>
                <div className="subtitle">File types: pdf, doc, docx, jpg, png</div>
              </div>
            </FormGroup>
          </Form>
        </ModalDialog>
        <ModalDialog
          title="Confirm Resend"
          className='message-dialog'
          showModal={this.state.modalState.confirmResendModal}
          onToggle={() => this.toggleModal("confirmResendModal")}
          footerBtns={[
            {
              key: "cancel",
              text: "Cancel",
              onclick: this.cancalResend,
              className: "custom-round-btn btn btn-secondary",
              icon: "fa-times",
            },
            {
              key: "confirm",
              text: "Confirm",
              onclick: this.resendEmail,
              className: "custom-round-btn btn btn-info",
              icon: "fa-paper-plane-o",
            },
          ]}
          displayAttachmentsIcon={this.displayAttachmentsIcon}
          displayAttachmentsError={this.displayAttachmentsError}
        >
          Are you sure you want to resend this email ?
        </ModalDialog>
        <ModalDialog
          className='message-dialog'
          title={this.state.dialogInfo.title}
          showModal={this.state.dialogInfo.modalState}
          displayAttachmentsIcon={this.displayAttachmentsIcon}
          displayAttachmentsError={this.displayAttachmentsError}
          onToggle={() => this.toggleModal("dialogInfo")}
        >
          {this.state.dialogInfo.body}
        </ModalDialog>
      </React.Fragment>
    );
  }
}

/**
 * redux mapDispatchToProps inbuilt function
 * maps component actions
 * @param {object} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  downloadAttachment: (reqParam) => dispatch(downloadAttachment(reqParam)),
  getMessageTabInfo: (reqParam) => dispatch(getMessageTabInfo(reqParam)),
  getMemberInboxMessages: (reqParam) => dispatch(getMemberInboxMessages(reqParam)),
  getMemberCompleteMessagesInfo: (reqParam) => dispatch(getMemberCompleteMessagesInfo(reqParam)),
  replyMemberMessage: (reqParam) => dispatch(replyMemberMessage(reqParam)),
  createNewMessage: (reqObj) => dispatch(createNewMessage(reqObj)),
  updateMemberMessages: (reqObj) => dispatch(updateMemberMessages(reqObj)),
});

/**
 * redux mapStateToProps inbuilt function
 * maps component state with the component props
 * @param {object} dispatch
 */
const mapStateToProps = (state) => {
  return {
    messageDetails: state.memberMessage.messageDetails,
    inboxMessageDetails: state.memberMessage.inboxMessageDetails,
    completeMessageDetails: state.memberMessage.completeMessageDetails,
    messageError: state.memberMessage.messageError,
    marked: state.memberMessage.marked,
    replyMessageSuccess: state.memberMessage.replyMessageSuccess,
    recipientDetails: state.memberProfile.callerInfo,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
