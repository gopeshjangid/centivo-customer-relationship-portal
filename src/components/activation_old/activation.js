import React, { Component } from 'react';
import { getActivationTabInfo } from './../../actions';
import Grid from './../../components/Grid';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Badge } from 'reactstrap';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel
} from 'react-accessible-accordion';
import {Loader} from './../wrapper';

// import 'react-accessible-accordion/dist/fancy-example.css';
import './scss/activation.scss';

let tableHeight = null;



class Activation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activationScreenPopup: false,
      tempEmail: '',
      tempPassword: ''
    };
    this.props.dispatch(getActivationTabInfo(props.memberId));

    if (sessionStorage.getItem('CSR_temp_userName')) {
      const reqParam = {
        userName: sessionStorage.getItem('CSR_temp_userName')
      };
    }
  }

  getStepsInfo = (text, record) => {
    return (
      <>
        {record && record.step
          ? record.step.map(step => <div>{step}</div>)
          : null}
      </>
    );
  };

  toggleModal = modalType => {
    this.setState(
      {
        activationScreenPopup: !this.state.activationScreenPopup
      },
      function() {
        if (this.state.activationScreenPopup) {
          let reqParam;
          if (!sessionStorage.csr_user_email) {
            reqParam = {
              memberUuid: window.atob(this.props.memberId)
            };
          } else {
            reqParam = {
              memberUuid: window.atob(this.props.memberId),
              email: sessionStorage.getItem('csr_user_email')
            };
          }

        } else {
          const reqParam = {
            userName: this.state.tempEmail
          };


          this.props.getActivationTabInfo(this.props.memberId);
        }
      }
    );
  };

  copyText = e => {
    let copyText = e.target.parentNode.previousSibling
      ? e.target.parentNode.previousSibling
      : e.target.parentNode.parentNode.previousSibling;
    copyText.select();
    document.execCommand('copy');
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  render() {
    const data = this.props.activationDetails;
    let activationData = null,
      goals = null,
      healthConditionArray = null,
      healthQuestionArray = null;

    const activatationJson = [
      {
        title: 'Information',
        render: (value, row, index) => {
          return row.information;
        }
      },
      {
        title: 'Value',
        render: (value, row, index) => {
          return row.value;
        }
      }
    ];

    activationData = data
      ? {
          ...this.props.activationDetails.activationStatus,
          ...this.props.activationDetails.incentives
        }
      : null;

    goals =
      data && data.goals
        ? data.goals.map(item => {
            return {
              ...item,
              goalTypeUuid: item.goalTypeUuid ? item.goalTypeUuid : '-',
              detail: item.detail ? item.detail : '-',
              description: item.description ? item.description : '-'
            };
          })
        : null;

    healthConditionArray =
      data && data.healthConditions
        ? data.healthConditions.map(item => {
            return {
              ...item,
              conditionUuid: item.conditionUuid ? item.conditionUuid : '-',
              answer: item.answer ? item.answer : '-',
              description: item.description ? item.description : '-'
            };
          })
        : null;

    healthQuestionArray =
      data && data.healthQuestions
        ? data.healthQuestions.map(item => {
            return {
              ...item,
              questionUuid: item.questionUuid ? item.questionUuid : '-',
              answer: item.answer ? item.answer : '-',
              description: item.description ? item.description : '-'
            };
          })
        : null;

    const goalsJSON = [
      {
        title: 'Goal Type UUID',
        key: 'goalTypeUuid',
        render: (value, row, index) => {
          return row.goalTypeUuid;
        }
      },
      {
        title: 'Details',
        key: 'detail',
        render: (value, row, index) => {
          return row.detail;
        }
      },
      {
        title: 'Description',
        key: 'description',
        render: (value, row, index) => {
          return row.description;
        }
      },
      {
        title: 'Step',
        key: 'step',
        render: this.getStepsInfo
      }
    ];

    const healthConditionJSON = [
      {
        title: 'Condition UUID',
        key: 'conditionUuid',
        render: (value, row, index) => {
          return row.conditionUuid;
        }
      },
      {
        title: 'Answer',
        key: 'answer',
        render: (value, row, index) => {
          return row.answer;
        }
      },
      {
        title: 'Description',
        key: 'description',
        render: (value, row, index) => {
          return row.description;
        }
      }
    ];

    const healthQuestionJSON = [
      {
        title: 'Condition UUID',
        key: 'questionUuid',
        render: (value, row, index) => {
          return row.questionUuid;
        }
      },
      {
        title: 'Answer',
        key: 'answer',
        render: (value, row, index) => {
          return row.answer;
        }
      },
      {
        title: 'Description',
        key: 'description',
        render: (value, row, index) => {
          return row.description;
        }
      }
    ];

    if (data && activationData) {
      activationData = [
        {
          information: 'Activation Status',
          value: activationData.activationFlag ? (
            <>
              <Badge color="success">True</Badge>
            </>
          ) : (
            <>
              <Badge color="danger">False</Badge>
              <button
                className="btn btn-primary activation-btn"
                onClick={() => this.toggleModal()}
              >
                Activate Member
              </button>
            </>
          )
        },
        {
          information: 'About Centivo Status',
          value: activationData.aboutCentivoCompleted
            ? activationData.aboutCentivoCompleted
            : '-'
        },
        {
          information: 'Health Question Status',
          value: activationData.healthQuestionsCompleted
            ? activationData.healthQuestionsCompleted
            : '-'
        },
        {
          information: 'Health Condition Status',
          value: activationData.healthConditionsCompleted
            ? activationData.healthConditionsCompleted
            : '-'
        },
        {
          information: 'Goals Status',
          value: activationData.goalsCompleted
            ? activationData.goalsCompleted
            : '-'
        },
        {
          information: 'PCP Choosen',
          value: activationData.pcpChosen ? (
            <Badge color="success">True</Badge>
          ) : (
            <Badge color="danger">False</Badge>
          )
        }
      ];
    }

    return (
      <>
        <div className="tab-page-container member-tab">
          {this.props.activationError ? (
            this.props.activationError.errorCode !== 'CEN_3605' ? (
              <Alert color="danger" className="text-center">
                {this.props.activationError.error}
              </Alert>
            ) : (
              <>
                <div className="text-center">
                  <div>
                    <br />
                    Do you want to activate this member ?
                  </div>
                  <br />
                  <button
                    className="btn btn-primary activation-btn"
                    onClick={() => this.toggleModal()}
                  >
                    Activate Member
                  </button>
                </div>
              </>
            )
          ) : null}
          {!this.props.activationError && activationData ? (
            <>
              <Grid
                columns={activatationJson}
                data={activationData}
                hoverable={false}
                justified={false}
                useFixedHeader={false}
                maxHeight={tableHeight}
                rowKey={record => record.invcentivePlanUuid}
              />
              <Accordion>
                {!this.props.activationError && goals ? (
                  <AccordionItem>
                    <AccordionItemHeading>
                      <span>View Goals</span>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <Grid
                        columns={goalsJSON}
                        data={goals}
                        hoverable={false}
                        justified={false}
                        useFixedHeader={true}
                        maxHeight={tableHeight}
                        rowKey={record => record.goalTypeUuid}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                ) : null}
                {!this.props.activationError && goals ? (
                  <AccordionItem>
                    <AccordionItemHeading>
                      <span>View Health Conditions</span>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <Grid
                        columns={healthConditionJSON}
                        data={healthConditionArray}
                        hoverable={false}
                        justified={false}
                        useFixedHeader={true}
                        maxHeight={tableHeight}
                        rowKey={record => record.conditionUuid}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                ) : null}
                {!this.props.activationError && goals ? (
                  <AccordionItem>
                    <AccordionItemHeading>
                      <span>View Health Questions</span>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <Grid
                        columns={healthQuestionJSON}
                        data={healthQuestionArray}
                        hoverable={false}
                        justified={false}
                        useFixedHeader={true}
                        maxHeight={tableHeight}
                        rowKey={record => record.questionUuid}
                      />
                    </AccordionItemPanel>
                  </AccordionItem>
                ) : null}
              </Accordion>
            </>
          ) : (
            !this.props.activationError && <Loader />)}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => {
  let actions = bindActionCreators({
    getActivationTabInfo: () => getActivationTabInfo()
  });
  return { ...actions, dispatch };
};

const mapStateToProps = state => {
  return {
    activationDetails: state.memberActivation.activationDetails,
    activationError: state.memberActivation.activationError
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Activation);
