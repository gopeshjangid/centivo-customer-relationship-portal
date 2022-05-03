import React, { Component } from 'react';
import {
  getMembersBySearch,
  setClearForm,
  setFamilyId,
  clearMemberSearch,
  clearMemberSearchResult
} from './../../actions';
import { connect } from 'react-redux';
import {_global} from './../../helpers/global';
import MemberSearchComponent from './../../components/memberSearch';


class MemberSearch extends Component {
  render() {
    return (<MemberSearchComponent parentProps={this.props}  />)
  }
}

const mapDispatchToProps = dispatch => {
    return {
        setClearForm: () => dispatch(setClearForm()),
        clearMemberSearch: () => dispatch(clearMemberSearch()),
        getMembersBySearch: (obj) => dispatch(getMembersBySearch(obj)),
        setFamilyId: (id) => dispatch(setFamilyId(id)),
        clearMemberSearchResult: () => dispatch(clearMemberSearchResult())
    }
};



const mapStateToProps = state => {
  return {
    members: state.memberSearch.members,
    loading: state.memberSearch.loading,
    searchError: state.memberSearch.searchError
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberSearch);
