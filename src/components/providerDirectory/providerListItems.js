import React, { Component } from "react";
import Layout from "../layout/layout";
import { formConstants } from "../../constants";
import { ClipLoader } from "react-spinners";
import "react-datepicker/dist/react-datepicker.css";
import { Card, Button, CardTitle, CardText, Row, Col } from "reactstrap";
import phoneIcon from "../../assets/images/Phone.svg";
import MinusIcon from "../../assets/images/minus.svg";
import RightChevIcon from "../../assets/icons/chevron-right@1x.svg";
import PlusIcon from "../../assets/images/plus.svg";
import { _global } from "../../helpers/global";
import "./css/providerDirectory.css";
//import axios from "axios";
import providerClient from "centivo-api-clients/packages/provider-client/index";

class ProviderListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listItem: [],
    };
  }

  listHandler = (index, type) => {
    const key = this.state.listItem.indexOf(index);
    const items = [...this.state.listItem];
    if (type === "add") {
      items.push(index);
    } else {
      items.splice(index, 1);
    }

    this.setState({ listItem: items });
  };

  render() {
    const {
      providersList,
      practitionarName,
      isFilterApplied,
      showSearchResult,
      distance,
      initialFilter,
    } = this.props;
    const showPracticeOnly =
      initialFilter.practitionarName || initialFilter.npi ? true : false;
    const titleLabel =
      initialFilter.practitionarName || initialFilter.npi
        ? " Practictioners found "
        : " Network Providers found ";
    return (
      <>
        {showSearchResult && providersList.length === 0 ? (
          <div className="noResultBox">
            <h4>No results found</h4>
            <p>
              Try changing your search criteria or location to improve your
              results.
            </p>
          </div>
        ) : (
          providersList.length > 0 && (
            <>
              <Card title className="card-list-title">
                <p className="highlight-text">
                  {providersList.length}
                  {titleLabel}
                </p>
                <p>&nbsp;</p>
                <p className="normal-text">within {distance || 100} miles</p>
              </Card>

              {providersList.length &&
                providersList.map((provider, index) => (
                  <Card body className="listBody">
                    <Row
                      key={index}
                      className="margin-bottom-24"
                      style={{ marginBottom: "10px" }}
                    >
                      <Col
                        md="12"
                        onClick={() =>
                          showPracticeOnly
                            ? this.props.chooseProvider(provider)
                            : ""
                        }
                        className="provider-list-item selected"
                      >
                        <Row>
                          <Col md={6}>
                            <CardText
                              className={
                                showPracticeOnly
                                  ? "practiceGroupName practiceGroup"
                                  : "networkPracticeName"
                              }
                            >
                              {showPracticeOnly ? (
                                <h5>
                                  {" "}
                                  {provider.firstName + " " + provider.lastName}
                                </h5>
                              ) : (
                                provider.practiceName
                              )}
                            </CardText>
                          </Col>
                          <Col md={6}>
                            <CardText
                              style={{ textAlign: "right" }}
                              className="distanceText"
                            >
                              <span>
                                {provider.distance}
                                {"Ml"}
                              </span>
                            </CardText>
                          </Col>
                          {showPracticeOnly && (
                            <>
                              {" "}
                              <Col md={12}>
                                <CardText className="practiceName">
                                  <h5>
                                    {provider.firstName} {provider.lastName}
                                  </h5>
                                </CardText>
                              </Col>
                              <Col md={12}>
                                <CardText className="practiceSpecility">
                                  {provider.primarySpecialty}{" "}
                                </CardText>
                              </Col>
                            </>
                          )}
                          <Col
                            md={12}
                            onClick={() => this.props.chooseProvider(provider)}
                          >
                            <CardText className="address">
                              {provider.billingAddress1}
                            </CardText>
                          </Col>
                          {provider.billingAddress2 && (
                            <Col md={12}>
                              <CardText className="address">
                                {provider.billingAddress2}
                              </CardText>
                            </Col>
                          )}
                          <Col md={12}>
                            <CardText className="address">
                              {provider.billingCity
                                ? provider.billingCity + ","
                                : ""}{" "}
                              {provider.billingState} {provider.billingZipCode}
                            </CardText>
                          </Col>
                          <Col md={12}>
                            {showPracticeOnly ? (
                              <div className="network-phone networkListPhoneBox">
                                <i className="icon icon-phone-primary practiceListPhoneIcon" />
                                <CardText
                                  onClick={() =>
                                    this.props.chooseProvider(provider)
                                  }
                                  className="practicePhone"
                                >
                                  {provider.practicePhone}
                                </CardText>
                              </div>
                            ) : (
                              <div className="practiceBox">
                                <div className="practiceDetailsTopBar">
                                  <CardText className="practiceTopBarTitle">
                                    View practitioners here
                                  </CardText>
                                  {this.state.listItem.indexOf(index) > -1 ? (
                                    <img
                                      onClick={() => {
                                        this.listHandler(index, "remove");
                                      }}
                                      className="openIcon"
                                      src={MinusIcon}
                                    />
                                  ) : (
                                    <img
                                      className="openIcon"
                                      onClick={() => {
                                        this.listHandler(index, "add");
                                      }}
                                      src={PlusIcon}
                                    />
                                  )}
                                </div>
                                {this.state.listItem.indexOf(index) > -1 ? (
                                  <>
                                    <div className="practicePhoneDetails">
                                      {provider.practicePhone && (
                                        <div className="network-phone practiceListPhoneBox">
                                          <i className="icon icon-phone practiceListPhoneIcon" />
                                          <CardText
                                            onClick={() =>
                                              this.props.chooseProvider(
                                                provider
                                              )
                                            }
                                            className="networkListPhone"
                                          >
                                            {provider.practicePhone}
                                          </CardText>
                                        </div>
                                      )}
                                    </div>
                                    <div className="practictionarsListWrapper">
                                      {provider.list.map(
                                        (practitionar, key) => {
                                          return (
                                            <div
                                              key={"pr-" + key}
                                              className="practitionarList"
                                            >
                                              <Row
                                                onClick={() =>
                                                  this.props.chooseProvider(
                                                    practitionar
                                                  )
                                                }
                                              >
                                                <Col md={6}>
                                                  <CardText className="practiceName ">
                                                    {practitionar.firstName}{" "}
                                                    {practitionar.lastName}
                                                  </CardText>
                                                  <CardText className="practiceListSpecility">
                                                    {
                                                      practitionar.primarySpecialty
                                                    }{" "}
                                                  </CardText>
                                                </Col>
                                                <Col
                                                  md={6}
                                                  className="openPrDetail"
                                                >
                                                  <img
                                                    className="openArrow"
                                                    src={RightChevIcon}
                                                  />
                                                </Col>
                                              </Row>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  ""
                                )}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                ))}
            </>
          )
        )}
      </>
    );
  }
}

export default ProviderListItem;
