import React, { Component } from 'react';
import ProviderDirectoryComponent from './../../components/providerDirectory/providerDirectory';
import ProviderDetail from './../../components/providerDirectory/providerDetails';
import { connect } from "react-redux";
import { clearSelectedProvider } from "../../actions/action.providerDirectory";
class ProviderDirectory extends Component {
  constructor(){
    super();
    this.state={
      actionType : 'SEARCH'
    }
  }

  chooseAction =(type) =>{
    if(this.state.actionType === 'DETAIL' &&  type  !== this.state.actionType){
    }
    
    this.setState({actionType : type })
  }
  render() {

    console.log("Actions type" ,this.state.actionType)
    return (<>{
     this.state.actionType ==="SEARCH" ? 
      <ProviderDirectoryComponent chooseAction={this.chooseAction} actionType={this.state.actionType} parentProps={this.props}  />
       : <ProviderDetail chooseAction={this.chooseAction}  />}</>)
  }
}


const mapDispatchToProps = (dispatch) => {
   return {clearSelectedProvider: () => dispatch(clearSelectedProvider('')) }
};



export default connect(
  null,
  mapDispatchToProps
)(ProviderDirectory);

