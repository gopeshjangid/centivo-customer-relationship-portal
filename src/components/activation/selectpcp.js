import React, { Component } from 'react';
import {
  Alert,
  Button,
  ModalHeader,
  Modal,
  ModalFooter,
  ModalBody
} from 'reactstrap';
import PcpChangeComponent from './../care/pcpChange';
import { ClipLoader } from 'react-spinners';
import { searchPcp } from '../../actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Selectpcp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPcp: null,
      isNotNpiName: false,
      invalidNpi: false,
      referralSelected: '',
      hasError: false,
      pcploading: false
    };

    this.findPCPList = this.findPCPList.bind(this);
  }

  componentDidUpdate(prevProps){
    if(prevProps.invalidNpi !== this.props.invalidNpi){
      this.setState({invalidNpi : this.props.invalidNpi})
    }
  }

  render() {
    return (
      <Modal
        isOpen={true}
        toggle={this.togglePcpModal}
        className="csr-activation"
      >
        <ModalHeader>
          Find a new PCP for{' '}
          {
            <span className="text-capitalize">
              {this.props.selectedMember.fullName}
            </span>
          }
        </ModalHeader>
        <ModalBody>
          {this.state.isNotNpiName ? (
            <Alert color="danger">
              NPI or First Name or Last Name is mandatory field.
            </Alert>
          ) : (
              ''
            )}
          {!this.state.pcploading ? (
            <PcpChangeComponent
              searchCriteria={this.props.searchCriteria}
              selectedPcp={this.state.selectedPcp}
              onChangeHandler={this.props.onChangeHandler}
              getSelectedPcpInfo={this.props.getSelectedPcpInfo}
              invalidNpiError={this.state.invalidNpi}
              handleDropDown={this.props.handleDropDown}
              handleCheck={this.props.handleCheck}
              referralSelected={this.props.referralSelected}
              hasError={this.state.hasError}
              modalType="updatePcp"
            />
          ) : (
              <div className="text-center">
                <ClipLoader loading={true} />
              </div>
            )}
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            className="cancel-btn"
            onClick={this.props.onToggle}
            disabled={this.props.pcploading ? true : false}
          >
            Cancel
          </Button>
          {this.props.pcpList ? (
            <Button
              className="primary-btn primary-btn-search"
              onClick={this.props.pcpSearchAgain}
              disabled={this.props.pcploading ? true : false}
            >
              Search Again
            </Button>
          ) : (
              <Button
                className="primary-btn"
                disabled={this.props.pcploading ? true : false}
                onClick={this.findPCPList}
              >
                Search
              </Button>
            )}
          {this.props.referralSelected ? (
            <Button
              className="primary-btn"
              disabled={this.props.pcploading ? true : false}
              onClick={e => this.props.updatePcpActivation(e)}
            >
              Save
            </Button>
          ) : null}
        </ModalFooter>
      </Modal>
    );
  }

  findPCPList() {
    let {
      npi,
      firstName,
      lastName,
      location,
      distance,
      specialty
    } = this.props.searchCriteria;
    this.setState({
      hasError: false,
      invalidNpi: false
    });
    if (
      (npi !== '' && !isNaN(npi)) ||
      (lastName !== '' && location !== '' && distance !== '')
      //  &&
      // specialty !== ''
    ) {
      this.props.searchPcp(this.props.searchCriteria);
    } else {
      if (isNaN(npi)) {
        this.setState({
          invalidNpi: true
        });
      } else if (
        npi == '' &&
        (lastName == '' || location == '' || distance == '')
        //  || specialty == ''
      ) {
        this.setState({
          hasError: true
        });
        return false;
      }
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    searchPcp: reqObj => dispatch(searchPcp(reqObj))
  }
};

const mapStateToProps = state => {
  return {
    callerInfo: state.memberProfile.callerInfo.details,
    pcpList: state.memberCare.pcpList
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Selectpcp);
