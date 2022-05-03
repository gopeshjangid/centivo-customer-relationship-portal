import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import MapContainer from "./../../containers/map/Map";
import "./css/providerDirectory.css";
import { clearSelectedProvider } from "../../actions/action.providerDirectory";
class ProviderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelModal: false,
      mapContainerWidth: 0,
    };
    this.mapContainerRef = React.createRef();
  }

  closeProviderDetail = () => {
    this.props.chooseAction("SEARCH");
    this.props.clearSelectedProvider('BACK');
  };

  toggleCancel = () => {
    this.setState({
      cancelModal: !this.state.cancelModal,
    });
  };

  render() {
    if (!this.props.selectedProvider) {
      return null;
    }

    const {
      firstName,
      lastName,
      practiceName,
      primarySpecialty,
      subSpecialty,
      languages,
      gender,
      npi,
      distance,
      address1,
      address2,
      practicePhone,
      practiceFax,
      state,
      zipCode,
      title,
    } = this.props.selectedProvider;

    return (
      <div>
        <div>
          <Container className="confirmation">
            <Modal
              isOpen={this.state.cancelModal}
              fade={false}
              backdrop={false}
              toggle={this.toggleCancel}
              className="close-confirmation-modal"
            >
              <ModalBody>
                <div className="confirmation-header">
                  Are you sure you want to close out of the referral process?
                </div>
              </ModalBody>
              <div className="confirmation-button">
                <Button
                  color="primary"
                  className="button button-primary"
                  onClick={this.toggleAll}
                >
                  Close
                </Button>
                <Button
                  className="button button-secondary"
                  onClick={this.toggleCancel}
                >
                  Cancel
                </Button>
              </div>
            </Modal>
          </Container>

          <Container>
            <ModalBody className="provider-details">
              <Row>
                <Col md={{ size: "5" }} sm={{ size: "5" }}>
                  <h1 className="provider-name">
                    <span
                      className="backtoSearch gop"
                      onClick={this.closeProviderDetail}
                    >
                      <i className="icon arrow-left" />
                    </span>{" "}
                    {firstName} {lastName + ","} {title}
                  </h1>
                  <p className="provider-specialty margin-top-12">
                    {primarySpecialty}
                  </p>

                  <div
                    className="margin-top-40 m-margin-top-10"
                    md={{ size: "4" }}
                    sm={{ size: "4" }}
                  >
                    <h3 className="about-provider">About</h3>

                    {subSpecialty && (
                      <>
                        <div className="margin-top-15">
                          <h5 className="provider-details-title margin-bottom-6">
                            Specialties
                          </h5>
                          <p className="provider-details-info">
                            {subSpecialty}
                          </p>
                        </div>
                      </>
                    )}
                    {/* {
                      <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                           Areas of focus
                        </h5>
                        <p className="provider-details-info">
                           Knee, Shoulder,ACL reconstruction, meniscal surgery, rotator cuff repair, and labral repair
                        </p>
                      </div>
                    } */}

                    {
                      <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                          Languages
                        </h5>
                        <p className="provider-details-info">{languages}</p>
                      </div>
                    }
                    {/* {
                      <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                        Hospital affiliations
                        </h5>
                         <p className="provider-details-info">
                         University of Virginia
                         </p>
                      </div>
                    } */}
                    {/* {
                      <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                        Education & Training
                        </h5>
                        <p className="provider-details-info">
                             Washington and Lee
                              Academic All American
                              Phi Beta Kappa / Phi Beta Sigma Medical Honor Society
                              University of Virginia
                        </p>
                      </div>
                    } */}
                    <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                        Gender
                        </h5>
                        <p className="provider-details-info">
                          {gender === 'm' ? 'MALE' : gender === 'f' ? "FEMAIL" : "ANY" }
                        </p>
                      </div>
                     {/*  <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                           Board certifications
                        </h5>
                        <p className="provider-details-info">
                           American Board of Orthopaedic Surgeons
                           American Academy of Orthopaedic Surgeons 
                        </p>
                      </div> */}

                    {npi && (
                      <div className="margin-top-15">
                        <h5 className="provider-details-title margin-bottom-6">
                          NPI number
                        </h5>
                        <p className="provider-details-info">{npi}</p>
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={6} sm={6} className="overflow-x-hidden">
                  <div
                    className="map-wrapper m-margin-top-20"
                    ref={this.mapContainerRef}
                  >
                    <MapContainer
                      location={this.props.selectedProvider?.location ?? ""}
                      width={this.state.mapContainerWidth}
                      geoCoord={{
                        latitude: this.props.selectedProvider.lat,
                        longitude: this.props.selectedProvider.long,
                      }}
                      gmapKey={this.props.gMapKey}
                    />
                  </div>
                  <Row>
                    <Col md={12}>
                      <h2 className="provider-location margin-top-15">
                        Location
                      </h2>
                      <Container className="flex-container location-box">
                        <Row className="margin-top-20">
                          <Col md="8" sm="8" className="NoLeftPadding">
                            <div>
                              <div className="mapBox">
                                <i className="icon icon-map-pin-primary" />
                                <h4 className="provider-details-title provider-location-title">
                                  {practiceName}
                                </h4>
                              </div>
                              <p className="provider-location-info">
                                {address1}
                                <br />
                                {address2} {state}
                                {zipCode}
                              </p>
                            </div>
                            <div className="contact-details">
                              {practicePhone && (
                                <>
                                  <div className="practice-phone">
                                    <i className="icon icon-phone-primary" />
                                    <p className="provider-location-title m-no-bold m-margin-left-30">
                                      {practicePhone}
                                    </p>
                                  </div>
                                </>
                              )}

                              {practiceFax && (
                                <>
                                  <p className="phone-fax provider-location-title m-no-bold m-margin-left-30">
                                    {practiceFax}
                                  </p>
                                </>
                              )}
                            </div>
                          </Col>
                          <Col md="4" sm="4">
                            <p className="provider-distance">{distance} Ml</p>
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </ModalBody>
          </Container>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    clearSelectedProvider: (data)=> dispatch(clearSelectedProvider(data)),
  };
};
const mapStateToProps = (state) => ({
  ...state.providerDirectory,
});

const ProviderDetailWrapper = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProviderDetail);

export default withRouter(ProviderDetailWrapper);
