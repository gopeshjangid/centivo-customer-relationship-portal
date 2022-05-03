import React, { Component } from 'react';
import {
  Container,
  Label,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Form,
  FormGroup,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { getResources } from './../../actions';
import { ReactSingleSelect } from './../../components/wrapper';
import { Loader } from './../../components/wrapper';
import './style/style.scss';

class Resources extends Component {
  constructor(props) {
    super(props);
    this.state = {
      getResourcesRequest: ''
    };
  }

  goToNewMessage = () => {
    this.props.history.push('/new-message#' + sessionStorage.getItem('param'));
  };

  redirectToMemberSearchPage = () => {
    this.props.history.push(
      '/member-search#' + sessionStorage.getItem('param')
    );
  };

  componentDidMount() {
    if (!this.props.resources.resourceResponse.resources || this.props.resources.resourceResponse.resources.length === 0) {
      this.props.getResources({
        clientIds: 'ALL CLIENTS'
      });
    }
  }



  clientIdModifier(data) {
    let displayValue = data.split(' ');
    if (data == 'ALL CLIENTS') {
      return (
        displayValue[0].charAt(0).toUpperCase() +
        displayValue[0].slice(1).toLowerCase()
      );
    }
    let capitalizedVal = displayValue.map(
      displayVal =>
        displayVal.charAt(0).toUpperCase() + displayVal.slice(1).toLowerCase()
    );

    return capitalizedVal.join(' ');
  }
  openBrowser(url) {
    window.open(url, '', ' scrollbars=yes,menubar=no,width=700,height=650,resizable=yes,toolbar=no,location=no,status=no')
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption },
      () => {
        let reqObj = {
          clientIds: this.state.selectedOption.value
        }
        this.props.getResources(reqObj)
      }
    );
  };

  findClientHandler = e => {
    this.setState(
      {
        getResourcesRequest: e.target.value
      },
      () =>
        this.props.getResources({
          clientIds: this.state.getResourcesRequest
        })
    );
  };

  render() {
    const { resourceResponse, fetching } = this.props.resources;
    // let optionData = [];
    // resourceResponse && resourceResponse.clientIds && resourceResponse.clientIds.map((val) => {
    //   optionData.push({
    //     label: val,
    //     value: val
    //   })
    // });


    return sessionStorage.getItem('isLoggedIn') ? (

      <Container className="margin-top-50">
        {
          !fetching ? (
            <Row>
              <Col md={{ offset: 1, size: 10 }}>
                <div className="resources-template">
                  <Row className="resource-autocomplete-wrapper">
                    <Col sm={{ offset: 1, size: 5 }} className="quick-access">
                      <Label className="label-large  resources-template-label">
                        Quick Access
                  </Label>
                      <div className="quick-access-links">
                        {resourceResponse &&
                          resourceResponse.quickResources &&
                          resourceResponse.quickResources.map(
                            (quickResource, key) => (
                              <p key={key}>
                                <a href={quickResource.value}>
                                  {quickResource.label}
                                </a>
                              </p>
                            )
                          )}
                      </div>
                    </Col>
                    <Col sm={5} className="find-client">
                      <Row>
                        <Col md={{ offset: 1, size: 11 }} className="no-padding">
                          <Form>
                            <FormGroup>
                              <Label className="label-large resources-template-label">
                                Find Client
                        </Label>
                        <Input
                            type="select"
                            className="no-border-radius"
                            onChange={this.findClientHandler}
                            value={this.state.getResourcesRequest}
                          >
                            {resourceResponse &&
                              resourceResponse.clientIds &&
                              resourceResponse.clientIds.map(
                                (clientId, index) => (
                                  <option
                                    value={clientId}
                                    key={`client_id_${index}`}
                                  >
                                    {/* {clientId.indexOf(' ') != -1
                                      ? this.clientIdModifier(clientId)
                                      : `${clientId.charAt(0).toUpperCase() +
                                          clientId.slice(1).toLowerCase()}`} */}
                                    {clientId.toUpperCase()}
                                  </option>
                                )
                              )}
                          </Input>
                            </FormGroup>
                          </Form>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={{ offset: 1, size: 11 }}>
                          
                            {
                              resourceResponse &&
                              resourceResponse.resources &&
                              resourceResponse.resources.map((resource, index) => (
                                <div className="client-pdf" key={`resource_${index}`}>
                                  <a href={resource.value}>{resource.label}</a>
                                </div>
                              ))
                            }

                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>) : <Loader />}
      </Container>
    ) : null;
  }
}

const mapDispatchToProps = dispatch => ({
  getResources: (reqObj) => dispatch(getResources(reqObj))
})

const mapStateToProps = state => ({
  resources: state.resources
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Resources);
