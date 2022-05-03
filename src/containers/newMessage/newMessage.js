import React, { Component } from 'react';
import {
  getAllTemplates,
  findMasterPlansRequest,
  createMessage,
  resetConfirmationModal,
  getMembersByFamilyId
} from '../../actions';
import { connect } from 'react-redux';
import ReactHtmlParser from 'react-html-parser';
import {
  Container,
  Form,
  FormGroup,
  Button,
  Col,
  Row,
} from 'reactstrap';
import moment from 'moment';
import { CriteriaSearch, SelectTemplate, ConfirmationBox } from './../../components/newMessage';
import ModalDialog from './../../components/modal-dialog/modalDialog';
import {Loader} from './../../components/wrapper';
require('./scss/newMessage.scss');


class NewMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateMessage: '',
      criteria: null,
      criteriaType: 'selectCriteria',
      selMemberIds: [],
      selMemberNames: [],
      modalToggleState: {
        createMessageNotificationModal: false,
        disabled: false
      },
      criteriaSearch: {
        gender: [],
        ageGroup: [],
        tier: [],
        dependentFilter: [],
        activation: [],
        planList: []
      },
      startDate: moment().toDate(),
      endDate: moment(),
      currentDate: moment().toDate(),
      templateListLoaded: false,
      messageType: {
        isTemplateSelected: false,
        description: null,
        masterMsgTemplateUuid: null,
        email: {
          sesTemplate: null,
          userVariableList: []
        },
        inApp: {
          messageType: null,
          messageSubject: null,
          messageText: null,
          userVariableList: []
        }
      },
      sensitive: false,
      modalState: {
        notValidMsg: ''
      }
    };

    this.props.getAllTemplates();
    this.props.findMasterPlansRequest();
  }

  gotToCreateTemplate = param => {
    this.props.history.push(
      '/create-template/' + param + '#' + sessionStorage.getItem('param')
    );
  };

  goToMessages = () => {
    this.props.history.push('/messages#' + sessionStorage.getItem('param'));
  };

  selectTemplateHandler = e => {
    let targetValue = e.target.value,
      index = e.target.selectedIndex,
      optionElement = e.target.childNodes[index],
      templateIndex = optionElement.getAttribute('index'),
      selectedTemplate = this.props.templateList[templateIndex];

    if (targetValue !== '-1') {
      this.setState({
        messageType: {
          ...this.state.messageType,
          isTemplateSelected: true,
          description: selectedTemplate.description,
          masterMsgTemplateUuid: selectedTemplate.masterMsgTemplateUuid,
          email: selectedTemplate.email
            ? {
              ...this.state.messageType.email,
              sesTemplate: selectedTemplate.email.sesTemplate,
              userVariableList: selectedTemplate.email.userVariableList
            }
            : null,
          inApp: selectedTemplate.inApp
            ? {
              ...this.state.messageType.inApp,
              messageType: selectedTemplate.inApp.messageType,
              messageSubject: selectedTemplate.inApp.messageSubject,
              messageText: selectedTemplate.inApp.messageText,
              userVariableList: selectedTemplate.inApp.userVariableList
            }
            : null
        }
      });
    } else {
      this.setState({
        messageType: {
          ...this.state.messageType,
          isTemplateSelected: false
        }
      });
    }
  };

  _isValidate = () => {
    const { criteria, memberDetails, criteriaType } = this.state;

    if (criteriaType === 'selectCriteria') {
      let flag = true;
      Object.keys(criteria).forEach(category => {
        Object.keys(criteria[category]).forEach(subcategory => {
          if (criteria[category][subcategory]) {
            flag = false;
            return '';
          }
        });
      });
      return '';
    } else if (criteriaType === 'selectEmailID') {
      if (memberDetails.length === 0) {
        return 'Minimum one familyID should be selected.';
      }
    } else {
      // nothing to do
    }
    return '';
  };

  confirmSendMessage = () => {
    const { sensitive, criteria, criteriaType, modalState, memberDetails, startDate,
      messageType, endDate, criteriaSearch } = this.state;
    modalState.notValidMsg = this._isValidate();

    if (modalState.notValidMsg === '') {
      let reqparam = null,
        userVariableList = [];

      const emailUserVariableList =
        messageType.email &&
        messageType.email.userVariableList,
        inAppUserVariableList =
          messageType.inApp &&
          messageType.inApp.userVariableList;

      if (emailUserVariableList && emailUserVariableList.length) {
        emailUserVariableList.map(emailUserVariableListItem => {
          userVariableList.push({
            variableType: 'EMAIL',
            name: emailUserVariableListItem.name,
            value: emailUserVariableListItem.defaultValue
          });
        });
      }

      if (inAppUserVariableList && inAppUserVariableList.length) {
        inAppUserVariableList.map(inAppUserVariableListItem => {
          userVariableList.push({
            variableType: 'IN_APP',
            name: inAppUserVariableListItem.name,
            value: inAppUserVariableListItem.defaultValue
          });
        });
      }

      if (criteriaType === 'selectEmailID') {
        reqparam = {
          sensitive: sensitive,
          memberDetails: memberDetails,
          startDate: `${moment(startDate).format('x')}`,
          endDate: `${moment(endDate).format('x')}`,
          template: {
            masterMsgTemplateUuid: messageType.masterMsgTemplateUuid,
            userVariableList: userVariableList
          }
        };
      } else {
        let planList = criteriaSearch.planList;
        reqparam = {
          sensitive: sensitive,
          criteria: {
            ...criteria,
            planList: planList,
            tier: {
              ...criteria.tier,
              allMembersFlag: true
            }
          },
          startDate: `${moment(startDate).format('x')}`,
          endDate: `${moment(endDate).format('x')}`,
          template: {
            masterMsgTemplateUuid: messageType.masterMsgTemplateUuid,
            userVariableList: userVariableList
          }
        };
      }
      this.props.createMessage(reqparam);
      this.setState({
        modalToggleState: {
          createMessageNotificationModal: true,
          disabled: true
        }
      });
    } else {
      this.setState({
        modalState: modalState,
        modalToggleState: {
          createMessageNotificationModal: true,
          disabled: true
        }
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.newMessageSuccess !== prevProps.newMessageSuccess) {
      setTimeout(() => {
        this.goToMessages()
        this.props.resetConfirmationModal()
      }, 5000)
    }
  }
  createMessage = () => {
    this.setState({
      modalToggleState: {
        createMessageNotificationModal: true,
        disabled: false
      }
    });
  };

  setCriteria = (criteria, criteriaSearch) => {
    this.setState({ criteria: criteria, criteriaSearch: criteriaSearch });
  };

  getSelMemberUid = selMembers => {
    let memberDetails =
      selMembers &&
      selMembers.map(selMember => ({
        employeeCertificateNumber: selMember.memberId,
        memberUuid: selMember.memberUuid
      }));

    let selMemberNames =
      selMembers && selMembers.map(selMember => selMember.name);
    this.setState({
      selMemberNames: selMemberNames,
      isMemberSelected: memberDetails.length !== 0 ? true : false,
      memberDetails
    });
  };

  getCriteriaType = criteriaType => {
    if (criteriaType == 'selectCriteria') {
      this.setState({
        criteriaType,
        isMemberSelected: false
      });
    } else if (criteriaType == 'selectEmailID')
      this.setState({
        criteriaType,
        criteriaSearch: {
          ...this.state.criteriaSearch,
          isPlanSelected: false
        }
      });
  };

  toggleModal = modalType => {
    this.setState({
      modalToggleState: {
        ...this.state.modalToggleState,
        createMessageNotificationModal:
          modalType === 'createMessageNotificationModal'
            ? !this.state.modalToggleState.createMessageNotificationModal
            : this.state.modalToggleState.createMessageNotificationModal
      }
    });
    if (modalType === 'createMessageNotificationModal') {
      this.props.resetConfirmationModal();
    }
  };

  hideModal = () => {
    this.setState({
      modalToggleState: {
        createMessageNotificationModal: false,
        disabled: false
      }
    });
  };

  handleChangeStart = date => {
    this.setState({
      startDate: date,
      endDate: date
    });
  };

  handleChangeEnd = date => {
    this.setState({
      endDate: date
    });
  };

  render() {
    const { messageType, criteriaSearch, isMemberSelected, modalToggleState, modalState, currentDate, startDate } = this.state;
    const { getMembersByFamilyId, templateListLoaded, newMessageSuccess, newMessageError, templateList } = this.props
    return (
      <Container>

      
      <Form className="input-custom margin-top-50" >
        <label className="label-large margin-bottom-20">
          Select criteria or enter family ID's
          </label>
        <CriteriaSearch
          criteria={this.setCriteria}
          selMemberUid={this.getSelMemberUid}
          criteriaType={this.getCriteriaType}
          getMembersByFamilyId={getMembersByFamilyId}
        />

        <div className="message-template">
          <Row>
            <Col md={12}>
              <FormGroup>
                {!templateListLoaded ? <Loader /> : (
                    <SelectTemplate
                      messageType={messageType}
                      templateList={templateList}
                      selectTemplateHandler={this.selectTemplateHandler}
                      startDate={startDate}
                      currentDate={currentDate}
                      handleChangeStart={this.handleChangeStart}
                    />
                  )}
              </FormGroup>
            </Col>
          </Row>
        </div>

        <FormGroup>
          <div className="button-row d-flex justify-content-end">
            <Button
              type="button"
              color="secondary"
              className="custom-round-btn margin-right-10"
              onClick={this.goToMessages}
              disabled={messageType.isTemplateSelected ? false : true}
            >
              <i className="fa fa-times" aria-hidden="true" />
              Cancel
              </Button>
              
            <Button
              type="button"
              color="default"
              className="button button-primary"
              onClick={this.createMessage}
              disabled={
                messageType.isTemplateSelected &&
                  (criteriaSearch.isPlanSelected ||
                    isMemberSelected)
                  ? false
                  : true
              }
            >
              Send
              </Button>
          </div>
          <ModalDialog
            title={newMessageSuccess || newMessageError ? '' : 'Are you sure for notification email ?'}
            onToggle={() => this.toggleModal('createMessageNotificationModal')}
            showModal={modalToggleState.createMessageNotificationModal}
            className="new-message-confirmation"
            footerBtns={
              !newMessageSuccess && !newMessageError && !this.props.sendingEmails
                ? [
                  {
                    key: 'cancel',
                    text: 'Cancel',
                    onclick: this.hideModal,
                    className: 'custom-round-btn btn btn-secondary'
                  },
                  {
                    key: 'confirm',
                    text: 'Confirm',
                    onclick: this.confirmSendMessage,
                    disabled: modalToggleState.disabled,
                    className: 'button button-primary'
                  }
                ]
                : null
            }
          >
            {newMessageSuccess ||
              newMessageError ||
              modalState.notValidMsg ? (
                <div className="text-center message-sent-success">
                  <i className="icon icon-check-circle" />
                  <h3 className="message-sent-success-msg">
                    {ReactHtmlParser(
                      newMessageSuccess ||
                      newMessageError ||
                      modalState.notValidMsg
                    )}
                  </h3>
                </div>
              ) : (
                <ConfirmationBox
                  criteria={this.state.criteria}
                  criteriaSearch={this.state.criteriaSearch}
                  criteriaType={this.state.criteriaType}
                  selMemberNames={this.state.selMemberNames}
                  templateUuid={this.state.messageType.masterMsgTemplateUuid}
                  description={this.state.messageType.description}
                  sendingEmails={this.props.sendingEmails}
                />
              )}
          </ModalDialog>
        </FormGroup>
      </Form>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getAllTemplates: () => dispatch(getAllTemplates()),
  findMasterPlansRequest: () => dispatch(findMasterPlansRequest()),
  createMessage: (reqObj) => dispatch(createMessage(reqObj)),
  resetConfirmationModal: () => dispatch(resetConfirmationModal()),
  getMembersByFamilyId: (reqObj) => dispatch(getMembersByFamilyId(reqObj))
})

const mapStateToProps = state => ({
  templateList: state.newMessage.templateList,
  templateListLoaded: state.newMessage.templateListLoaded,
  newMessageError: state.newMessage.newMessageError,
  newMessageSuccess: state.newMessage.newMessageSuccess,
  sendingEmails: state.newMessage.sendingEmails
});

export default connect(mapStateToProps, mapDispatchToProps)(NewMessage);