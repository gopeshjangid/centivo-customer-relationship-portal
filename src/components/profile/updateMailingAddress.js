import React from 'react';
import { renderTextField } from './../wrapper';
import { Field, reduxForm } from 'redux-form';
import {Form, Col, FormGroup, Button} from 'reactstrap';
import { validation } from './../../helpers'

const UpdateMailingAddress = props => {
    const { handleSubmit, pristine, reset, submitting, mailingAddress } = props

    return (
            <Form onSubmit={handleSubmit(props.handleAddressUpdate)}>
                <FormGroup row>
                    <Col md="6">
                        <Field 
                            name="street1"
                            id="street1"
                            placeholder="Street 1"
                            label="Street 1"
                            component={renderTextField}
                        />
                    </Col>
                    <Col md="6">
                        <Field 
                            type="text"
                            name="street2"
                            id="street2"
                            placeholder="Street 2"
                            label="Street 2"
                            component={renderTextField}
                        />
                    </Col>
                </FormGroup>
                <FormGroup row>
                <Col md="6">
                    <Field 
                        type="text"
                        name="street3"
                        id="street3"
                        placeholder="Street 3"
                        label="Street 3"
                        component={renderTextField}
                    />
                  </Col>
                  <Col md="6">
                    <Field 
                        type="text"
                        name="city"
                        id="city"
                        placeholder="City"
                        label="City"
                        component={renderTextField}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                <Col md="6">
                    <Field 
                        type="text"
                        name="state"
                        id="state"
                        placeholder="State"
                        label="State"
                        component={renderTextField}
                    />
                  </Col>
                  <Col md="6">
                    <Field 
                        type="text"
                        name="zip"
                        id="zip"
                        placeholder="eg. 27402"
                        label="ZIP"
                        component={renderTextField}
                    />
                  </Col>
                </FormGroup>
                <FormGroup className="text-center margin-top-30">
                    <Button 
                        color="primary"
                        type="submit"
                        // disabled={pristine || submitting}
                        >
                             Update
                    </Button>{' '}
                    <Button 
                        color="secondary"
                        onClick={props.handleToggleAddress}>
                            Cancel
                    </Button>
                </FormGroup>
            </Form>
        )
    }


export default reduxForm({
    form: 'updateMailingAddress' 
  })(UpdateMailingAddress)