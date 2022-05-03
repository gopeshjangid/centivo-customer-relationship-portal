import React, { Component } from "react";
import { getInboxMessages, replyMessageList, getMemberOutboxMessages, getMemberCompleteMessages, updateMessages, downloadAttachment } from "./../../actions";
import ModalDialog from "../../components/modal-dialog/modalDialog";

import { _global } from "./../../helpers/global";
import { connect } from "react-redux";
import moment from "moment";
import { Button, FormGroup, Input, Form, Container, Alert, Label } from "reactstrap";
import { MessageTable } from "./../../components/messageList";
import { Loader } from "./../../components/wrapper";
import "./style/messageList.scss";

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedRowKeysArray: [],
      messageUuid: null,
      expandedDataType: null,
      modalState: {
        forwardEmailModal: false,
      },
      emailSubject: "",
      emailBody: "",
      dialogInfo: {
        title: "",
        body: "",
        modalState: false,
      },
      replyEmail: {
        replyMessage: null,
      },
      characterRequired: null,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.replyMessagesSuccess || props.replyMessagesFailure) {
      return {
        ...state,
        modalState: {
          forwardEmailModal: false,
          memberUuid: undefined,
          messageUuid: undefined,
        },
        emailSubject: null,
        emailBody: null,
      };
    }
    return null;
  }

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
      fullName,
      //   emailBody: emailBody
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

  replyEmail = (e) => {
    e.preventDefault();
    const { replyEmail, modalState, files } = this.state;
    if (replyEmail.replyMessage && replyEmail.replyMessage.length >= 20) {
      let reqObj = {
        memberUuid: modalState.memberUuid,
        messageId: modalState.messageUuid,
        message: replyEmail.replyMessage,
        files
      };
      this.props.replyMessageList(reqObj);
      this.setState({
        replyEmail: {
          ...replyEmail,
          replyMessage: "",
        },
      });
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
      return 'failed'
    }
  };

  onReplyChangeHandler = (event) => {
    event.preventDefault();
    let replyEmail = this.state.replyEmail;
    let { name, value } = event.target;
    replyEmail[name] = value;
    this.setState({ replyEmail });
  };

  toggleModal = (modalType) => {
    this.setState({
      modalState: {
        forwardEmailModal: modalType === "forwardEmailModal" ? !this.state.modalState.forwardEmailModal : this.state.modalState.forwardEmailModal,
      },
      dialogInfo: {
        modalState: false,
      },
    });
  };

  goToNewMessage = () => {
    this.props.history.push("/new-message#" + sessionStorage.getItem("param"));
  };

  componentDidMount() {
    const reqParam = {
      messageFolder: "inbox",
    };
    this.props.getInboxMessages(reqParam);
  }

  render() {
    const { inboxMessageDetails, completeMessageDetails, retriveReplyMessageSuccess } = this.props;
    let inboxData = inboxMessageDetails && inboxMessageDetails.messages,
      completeData = completeMessageDetails && completeMessageDetails.messages,
      outBoxTableData =
        retriveReplyMessageSuccess &&
        retriveReplyMessageSuccess.sort(function(a, b) {
          if (a.createdTimestamp > b.createdTimestamp) {
            return -1;
          }
          if (a.createdTimestamp < b.createdTimestamp) {
            return 1;
          }
          return 0;
        });

    outBoxTableData = outBoxTableData
      ? outBoxTableData.map((item) => {
          return {
            ...item,
            msgText: item.msgText ? item.msgText : "-",
            msgType: item.msgType ? item.msgType : "-",
            msgSubject: item.msgSubject ? item.msgSubject : "-",
          };
        })
      : null;

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

    return (
      <Container className="margin-top-50">
        <React.Fragment>
          {this.props.marked && <Loader />}

          <>
            <MessageTable
              inboxData={inboxData}
              memberMessageFlag={false}
              completeData={completeData}
              memberUuid={""}
              outBoxTableData={outBoxTableData}
              getMemberCompleteMessages={this.props.getMemberCompleteMessages}
              getInboxMessages={this.props.getInboxMessages}
              getMemberOutboxMessages={this.props.getMemberOutboxMessages}
              modalForReplyMsg={this.modalForReplyMsg}
              updateMessages={this.props.updateMessages}
              downloadAttachment={this.props.downloadAttachment}
            />
            <ModalDialog
              title="In-App Message"
              showModal={this.state.modalState.forwardEmailModal}
              onToggle={() => this.toggleModal("forwardEmailModal")}
              footerBtns={[
                {
                  key: "send",
                  text: "SEND",
                  onclick: this.replyEmail,
                  className: "custom-round-btn btn btn-info",
                  icon: "icon icon-send",
                },
              ]}
              footerBtnsAttachement
              displayAttachmentsIcon={this.displayAttachmentsIcon}
              displayAttachmentsError={this.displayAttachmentsError}
              className="custom-model-reply"
            >
              <Form>
                <Alert color="danger" isOpen={this.props.replyMessagesFailure}>
                  {this.props.replyMessagesFailure ? this.props.replyMessagesFailure : null}
                </Alert>

                <Alert color="danger" isOpen={this.state.characterRequired ? true : false}>
                  {this.state.characterRequired ? this.state.characterRequired : null}
                </Alert>
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
                {this.state.filesUploadErrorDisplay && this.state.filesUploadErrorDisplay}
                {this.state.filesDisplay && this.state.filesDisplay}
                <FormGroup>
                  <Label for="message">Message</Label>
                  <Input type="textarea" name="replyMessage" id="message" placeholder="Message" onChange={this.onReplyChangeHandler} />
                  <div className="isDragActiveOverlay">
                    <div className="title">Drop files here</div>
                    <div className="subtitle">File types: pdf, doc, docx, jpg, png</div>
                  </div>
                </FormGroup>
              </Form>
            </ModalDialog>
            <ModalDialog
              title="Confirm Resend"
              showModal={this.state.modalState.confirmResendModal}
              onToggle={() => this.toggleModal("confirmResendModal")}
              footerBtnsAttachement
              displayAttachmentsIcon={this.displayAttachmentsIcon}
              displayAttachmentsError={this.displayAttachmentsError}
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
            >
              Are you sure you want to resend this email ?
            </ModalDialog>

            <ModalDialog
              title={this.state.dialogInfo.title}
              showModal={this.state.dialogInfo.modalState}
              onToggle={() => this.toggleModal("dialogInfo")}
              footerBtnsAttachement
              displayAttachmentsIcon={this.displayAttachmentsIcon}
              displayAttachmentsError={this.displayAttachmentsError}
            >
              {this.state.dialogInfo.body}
            </ModalDialog>
          </>
        </React.Fragment>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  downloadAttachment: (reqParam) => dispatch(downloadAttachment(reqParam)),
  getInboxMessages: (reqParam) => dispatch(getInboxMessages(reqParam)),
  getMemberCompleteMessages: (reqParam) => dispatch(getMemberCompleteMessages(reqParam)),
  getMemberOutboxMessages: () => dispatch(getMemberOutboxMessages()),
  updateMessages: (reqObj) => dispatch(updateMessages(reqObj)),
  replyMessageList: (reqObj) => dispatch(replyMessageList(reqObj)),
});

const mapStateToProps = (state) => ({
  messageDetails: state.messageList.messageDetails,
  inboxMessageDetails: state.messageList.inboxMessageDetails,
  completeMessageDetails: state.messageList.completeMessageDetails,
  replyMessagesFailure: state.messageList.replyMessagesFailure,
  replyMessagesSuccess: state.messageList.replyMessageSuccess,
  retriveReplyMessageSuccess: state.messageList.retriveReplyMessageSuccess,
  retriveReplyMessageFailure: state.messageList.retriveReplyMessageFailure,
  retrieveSingleReplyMessageSuccess: state.messageList.retrieveSingleReplyMessageSuccess,
  retrieveSingleReplyMessageFailure: state.messageList.retrieveSingleReplyMessageFailure,
  marked: state.messageList.marked,
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);
