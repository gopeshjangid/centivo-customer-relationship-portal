import React, { Component } from 'react';
import {
  FormGroup,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  Label,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import {Loader} from './../../wrapper';
import { connect } from 'react-redux';
import Well from '../../../assets/well/well';
import { keyConstants } from '../../../constants';
import classnames from 'classnames';


require('./scss/criteriaSearch.scss');

class CriteriaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'selectCriteria',
      openSearchBox: true,
      openCriteria: true,
      selectedMembers: [],
      familyIdMembersList: [],
      searchText: '',
      criteria: {
        gender: {
          maleFlag: false,
          femaleFlag: false
        },
        ageGroup: {
          youngAdultFlag: false,
          middleAgeAdultFlag: false,
          olderAdultFlag: false
        },
        tier: {
          allMembersFlag: false,
          employeeFlag: false,
          employeeWithSpouseFlag: false,
          employeeWithFamilyFlag: false,
          employeeWithChildrenFlag: false
        },
        dependentFilter: {
          employeeFlag: false,
          spouseFlag: false,
          adultDependentFlag: false
        },
        activation: {
          activationCompleted: false,
          activationNotStarted: false,
          activationIncomplete: false
        },
        planList: {
          cone1: false,
          fake1: false
        },
        duplicatesAllowed: false,
        findMemberResultError: false
      },
      criteriaSearch: {
        gender: [],
        ageGroup: [],
        tier: [],
        dependentFilter: [],
        activation: [],
        planList: []
      },
      searchLoading: false
    };
    
    this.resetForm = this.resetForm.bind(this);
  }

  static getDerivedStateFromProps(props, state){
   
      return{
        findMemberResultError: props.findMemberResultError,
        searchLoading:false,
        familyIdMembersList: props.membersByFamilyId
      }
    
  }

  /**
   * toggle tabs inside message tab window.
   * @param {string} tab
   */
  toggleTabs = tab => {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.resetForm();
      this.setState({
        activeTab: tab
      });
    }
    this.props.criteriaType(tab);
  };

  /**
   * on change listner of search box.
   * @param {event} event
   */
  searchOnChange = event => {
    this.setState({
      searchText: event.target.value.trim().toUpperCase()
    });
    if (!event.target.value) {
      this.setState({
        searchText: '',
        familyIdMembersList: []
      });
    } else {
      //this.clearFilters()
    }
  };

  /**
   * set selected members to state object.
   * @param {array} selectedMembers
   */
  setSelMemberUid = selectedMembers => {
    let selMemberUuids = [];
    selectedMembers.map(member =>
      selMemberUuids.push({
        memberId: member.memberId,
        name: member.name,
        memberUuid: member.memberUuid
      })
    );

    this.props.selMemberUid(selMemberUuids);
  };

  /**
   * set selected member to state object.
   * @param {object} member
   * @param {integer} index
   */
  addToSelectedMember = (member, index) => {
    const { searchText, familyIdMembersList, selectedMembers } = this.state;
    selectedMembers.push(member);
    familyIdMembersList.splice(index, 1);
    this.setState({
      selectedMembers: selectedMembers,
      searchText: familyIdMembersList.length === 0 ? '' : searchText,
      familyIdMembersList: familyIdMembersList
    });
    this.setSelMemberUid(selectedMembers);
  };

  /**
   * remove selected member to state object.
   * @param {integer} index
   */
  removeFromSelectedMember = index => {
    const { selectedMembers } = this.state;
    selectedMembers.splice(index, 1);
    this.setState({
      selectedMembers: selectedMembers
    });
    this.setSelMemberUid(selectedMembers);
  };

  /**
   * call backend API to fetch family member list from the entered family ID.
   */
  searchMembers = e => {
    e.preventDefault();
    const { searchText } = this.state;
    if (searchText && searchText.length > 0) {
      this.setState({
        searchLoading: true,
        findMemberResultError:false
      });

      if (searchText) {
        const param = {
          familyId: '' + searchText
        };
        this.props.getMembersByFamilyId(param)
        
      }
    }
  };

  /**
   * reset the form to initial state
   */
  resetForm = () => {
    this.setState({
      criteria: {
        gender: { maleFlag: false, femaleFlag: false },
        ageGroup: {
          youngAdultFlag: false,
          middleAgeAdultFlag: false,
          olderAdultFlag: false
        },
        tier: {
          allMembersFlag: false,
          employeeFlag: false,
          employeeWithSpouseFlag: false,
          employeeWithFamilyFlag: false,
          employeeWithChildrenFlag: false
        },
        dependentFilter: {
          employeeFlag: false,
          spouseFlag: false,
          adultDependentFlag: false
        },
        activation: {
          activationCompleted: false,
          activationIncomplete: false,
          activationNotStarted: false
        }
      },
      criteriaSearch: {
        gender: [],
        ageGroup: [],
        tier: [],
        dependentFilter: [],
        activation: [],
        planList: []
      },

      familyIdMembersList: [],
      selectedMembers: []
    });
    this.props.selMemberUid([]);
    this.props.criteria(this.state.criteria, this.state.criteriaSearch);
  };

  /**
   * Description: handle the enter key press event
   * @param {object}
   * @return {null}
   */
  handleEnterKeyPress = e => {
    if (e.charCode === keyConstants.ENTER) {
      if (e.currentTarget.value && e.currentTarget.value.length > 0) {
        this.searchMembers(e);
      }
    }
  };

  /**
   * update the selected criteria options to state object
   * @param {object} event
   * @param {string} category
   * @param {string} subcategory
   */

  enableDuplicates = () => {
    const { criteria, criteriaSearch } = this.state;
    criteria.duplicatesAllowed = !criteria.duplicatesAllowed;
    this.setState({ criteria: criteria });
    this.props.criteria(criteria, criteriaSearch);
  };

  selectPlanType = e => {
    this.setState(
      {
        criteriaSearch: {
          ...this.state.criteriaSearch,
          planList: [e.target.value],
          isPlanSelected: true
        }
      },
      () => {
        this.props.criteria(this.state.criteria, this.state.criteriaSearch);
      }
    );
    
  };

  /**
   * set the criterea to all
   */
  setCriteriaAll = status => {
    const { criteria } = this.state;
    Object.keys(criteria).forEach(category => {
      Object.keys(criteria[category]).forEach(subcategory => {
        criteria[category][subcategory] = status;
      });
    });
    this.setState({ criteria: criteria });
  };

  updateFilters = (category, subcategory) => {
    const { criteria } = this.state;
    criteria[category][subcategory] = !criteria[category][subcategory];
    if (subcategory === 'allMembersFlag') {
      this.setCriteriaAll(criteria[category][subcategory]);
    } else {
      criteria['tier']['allMembersFlag'] = true;
    }

    this.setState({ criteria: criteria });
    this.props.criteria(criteria);
  };

  handleFilters = e => {
    let { criteriaSearch, criteria } = this.state,
      { name, value, checked } = e.target,
      flagValue;
    console.dir(e.target);
    if (name == 'ageGroup' || name == 'activation') {
      if (value == '18-35') {
        flagValue = 'youngAdultFlag';
      } else if (value == '36-50') {
        flagValue = 'middleAgeAdultFlag';
      } else if (value == '50+') {
        flagValue = 'olderAdultFlag';
      } else {
        flagValue =
          value.charAt(0).toLowerCase() + value.slice(1).replace(/ /g, '');
      }
    } else {
      flagValue =
        value.charAt(0).toLowerCase() +
        value.slice(1).replace(/ /g, '') +
        'Flag';
    }
    if (checked) {
      this.setState(
        {
          criteriaSearch: {
            ...criteriaSearch,
            [name]: [...criteriaSearch[name], value]
          },
          criteria: {
            ...criteria,
            [name]: {
              ...criteria[name],
              [flagValue]: true
            }
          }
        },
        () =>
          this.props.criteria(this.state.criteria, this.state.criteriaSearch)
      );
    } else {
      let categoryOptionsSelected = criteriaSearch[name];
      let categoryOptionsDeselected = categoryOptionsSelected.splice(
        criteriaSearch[name].indexOf(value),
        1
      );
      this.setState(
        {
          criteriaSearch: {
            ...criteriaSearch,
            [name]: categoryOptionsSelected
          },
          criteria: {
            ...criteria,
            [name]: {
              ...criteria[name],
              [flagValue]: false
            }
          }
        },
        () =>
          this.props.criteria(this.state.criteria, this.state.criteriaSearch)
      );
    }
  };

  /**
   * render to html
   * @param {null}
   * @return {string}
   */
  render() {
    const {
      searchText,
      familyIdMembersList,
      selectedMembers,
      criteria
    } = this.state;
    return (
      <>
        <div className="tab-container selectionCriteria">
          <Nav tabs>
            <NavItem key="selectCriteria">
              <NavLink
                onClick={e => this.toggleTabs('selectCriteria')}
                className={classnames({
                  active: this.state.activeTab === 'selectCriteria'
                })}
              >
                Select Criteria
              </NavLink>
            </NavItem>
            <NavItem key="selectEmailID">
              <NavLink
                onClick={e => this.toggleTabs('selectEmailID')}
                className={classnames({
                  active: this.state.activeTab === 'selectEmailID'
                })}
              >
                Enter Family ID(s)
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab} className="main-bg">
            <TabPane tabId="selectCriteria">
              <FormGroup className="selectCriteriaList">
                <FormGroup>
                  <Label for="selectTier" className="message-header">Coverage Type</Label>
                  <div className="inline-radio">
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .tier.employeeFlag,
                            'icon-checkbox-selected': this.state.criteria.tier
                              .employeeFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="tier"
                          value="Employee"
                          onChange={this.handleFilters}
                          checked={this.state.criteria.tier.employeeFlag}
                        />
                        Employee
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .tier.employeeWithSpouseFlag,
                            'icon-checkbox-selected': this.state.criteria.tier
                              .employeeWithSpouseFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="tier"
                          value="Employee With Spouse"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.tier.employeeWithSpouseFlag
                          }
                        />
                        Employee With Spouse
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .tier.employeeWithChildrenFlag,
                            'icon-checkbox-selected': this.state.criteria.tier
                              .employeeWithChildrenFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="tier"
                          value="Employee With Children"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.tier.employeeWithChildrenFlag
                          }
                        />
                        Employee With Children
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .tier.employeeWithFamilyFlag,
                            'icon-checkbox-selected': this.state.criteria.tier
                              .employeeWithFamilyFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="tier"
                          value="Employee With Family"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.tier.employeeWithFamilyFlag
                          }
                        />
                        Employee With Family
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="selectActivation" className="message-header">Activation Status</Label>
                  <div className="inline-radio">
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .activation.activationNotStarted,
                            'icon-checkbox-selected': this.state.criteria
                              .activation.activationNotStarted
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="activation"
                          value="Activation Not Started"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.activation.activationNotStarted
                          }
                        />
                        Activation Not Started
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .activation.activationIncomplete,
                            'icon-checkbox-selected': this.state.criteria
                              .activation.activationIncomplete
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="activation"
                          value="Activation Incomplete"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.activation.activationIncomplete
                          }
                        />
                        Activation Incomplete
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .activation.activationCompleted,
                            'icon-checkbox-selected': this.state.criteria
                              .activation.activationCompleted
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="activation"
                          value="Activation Completed"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.activation.activationCompleted
                          }
                        />
                        Activation Completed
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="selectDependent" className="message-header">Employee Type</Label>
                  <div className="inline-radio">
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .dependentFilter.employeeFlag,
                            'icon-checkbox-selected': this.state.criteria
                              .dependentFilter.employeeFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="dependentFilter"
                          value="Employee"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.dependentFilter.employeeFlag
                          }
                        />
                        Employee
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .dependentFilter.spouseFlag,
                            'icon-checkbox-selected': this.state.criteria
                              .dependentFilter.spouseFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="dependentFilter"
                          value="Spouse"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.dependentFilter.spouseFlag
                          }
                        />
                        Spouse
                      </Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Label check>
                        <i
                          className={classnames('icon', {
                            'icon-checkbox-unselected': !this.state.criteria
                              .dependentFilter.adultDependentFlag,
                            'icon-checkbox-selected': this.state.criteria
                              .dependentFilter.adultDependentFlag
                          })}
                        />
                        <Input
                          type="checkbox"
                          className="criteriaInput"
                          name="dependentFilter"
                          value="Adult Dependent"
                          onChange={this.handleFilters}
                          checked={
                            this.state.criteria.dependentFilter
                              .adultDependentFlag
                          }
                        />
                        Adult Dependent
                      </Label>
                    </FormGroup>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="selectPlan" className="message-header">Client ID*</Label>
                  <div className="inline-radio">
                    {this.props.planList &&
                      this.props.planList.map((plan, planId) => (
                        <FormGroup check inline key={planId}>
                          <Label check>
                            <i
                              className={classnames('icon', {
                                'icon-radio-unselected':
                                  this.state.criteriaSearch.planList[0] !==
                                  plan.planUuid,
                                'icon-radio-selected':
                                  this.state.criteriaSearch.planList[0] ==
                                  plan.planUuid
                              })}
                            />
                            <Input
                              type="radio"
                              className="criteriaInput"
                              name="planList"
                              value={plan.planUuid}
                              onChange={this.selectPlanType}
                              checked={
                                this.state.criteriaSearch.planList[0] ==
                                plan.planUuid
                                  ? true
                                  : false
                              }
                            />
                            {plan.planUuid}
                          </Label>
                        </FormGroup>
                      ))}
                  </div>
                </FormGroup>
              </FormGroup>
            </TabPane>

            <TabPane tabId="selectEmailID">
              <span>
                {selectedMembers.map((member, index) => (
                  <Label
                    className="button button-selected-member"
                    key={member.memberUuid}
                  >
                    {member.name} <i className="icon pointer icon-x-circle" onClick={() => this.removeFromSelectedMember(index)}/>
                    </Label>
                ))}
              </span>
              <Well
                className="card"
                style={{
                  border: familyIdMembersList && familyIdMembersList.length
                    ? '1px solid rgba(0, 0, 0, 0.125)'
                    : ''
                }}
              >
                <InputGroup className="">
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="off"
                    autoFocus
                    placeholder="Enter Family Id"
                    value={searchText}
                    onChange={this.searchOnChange}
                    onKeyPress={this.handleEnterKeyPress}
                    className="form-control"
                  />
                  <InputGroupAddon
                    addonType="append"
                    className="search-bar-wraaper"
                    onClick={this.searchMembers}
                  >
                      <i className="icon icon-search" />
                    
                  </InputGroupAddon>
                </InputGroup>
                {!!this.state.findMemberResultError && (
                  <div className="text-center text-danger">
                    <br />
                    <br />
                    <br />
                    { 
                      this.state.findMemberResultError
                     }
                  </div>
                )}
                <ul className="list-group list-group-flush">
                  {familyIdMembersList && familyIdMembersList.length > 0 &&
                    familyIdMembersList.map((familyMember, index) => (
                      <li
                        key={familyMember.memberUuid}
                        onClick={() =>
                          this.addToSelectedMember(familyMember, index)
                        }
                        className="list-group-item list-group-item-action"
                      >
                        {familyMember.name}
                      </li>
                    ))}
                </ul>
                <div className="searchLoader text-center">
                  {this.props.memberSearchLoading ? <Loader /> : null}
                </div>
              </Well>
            </TabPane>
          </TabContent>
        </div>
      </>
    );
  }
}

/**
 * redux mapping of state to props function
 * @param {object} state
 * @return {object}
 */
const mapStateToProps = state => ({
  searchError: state.memberSearch.searchError,
  members: state.memberSearch.members,
  planList: state.newMessage.planList,
  membersByFamilyId: state.newMessage.members,
  memberSearchLoading:state.newMessage.memberSearchLoading,
  findMemberResultError:state.newMessage.findMemberResultError
});

export default connect(
  mapStateToProps,
  null
)(CriteriaSearch);
