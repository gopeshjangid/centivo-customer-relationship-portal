import React, { Component } from 'react';
import {
  getMembersBySearch,
  setClearForm,
  setFamilyId,
  clearProviderDirectory,
  clearProviderDirectoryResult
} from '../../actions';
import { connect } from 'react-redux';
import {_global} from '../../helpers/global';
import ProviderDetail from '../../components/providerDirectory/providerDetails';


class ProviderDetails extends Component {
  render() {
    return (<ProviderDetail parentProps={this.props}  />)
  }
}

const mapDispatchToProps = dispatch => {
    return {
        // setClearForm: () => dispatch(setClearForm()),
        // clearProviderDirectory: () => dispatch(clearProviderDirectory()),
        // getMembersBySearch: (obj) => dispatch(getMembersBySearch(obj)),
        // setFamilyId: (id) => dispatch(setFamilyId(id)),
        // clearProviderDirectoryResult: () => dispatch(clearProviderDirectoryResult())
    }
};



const mapStateToProps = state => {
  return {
    // members: state.memberSearch.members,
    // loading: state.memberSearch.loading,
    // searchError: state.memberSearch.searchError
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderDetails);
