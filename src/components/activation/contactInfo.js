import React from 'react';
import ModalDialog from '../modal-dialog/modalDialog';
import { Form, FormGroup, Label, Col, Input, Alert } from 'reactstrap';

const ContactInfo = props => {
  return (
    <ModalDialog
      title="Update member contact info"
      showModal={true}
      className="csr-activation"
      onToggle={props.onToggle}
      noCloseIcon={true}
      footerBtns={[
        {
          key: 'cancel',
          text: 'Cancel',
          className: 'cancel-btn',
          onclick: props.onToggle
        },
        {
          key: 'next',
          text: 'Next',
          className: 'primary-btn',
          onclick: () => props.toggleActivationScreen('planDetails'),
          disabled: !props.profile.email || !props.profile.phone
        }
      ]}
    >
      {!props.profile.isValid && (
        <Alert color="danger">Email or Phone is invalid.</Alert>
      )}
      <Form className="contact-info">
        <FormGroup row className="align-items-center">
          <Label xs={2} for="email" className="text-right">
            Email
          </Label>
          <Col xs={10}>
            <Input
              type="email"
              name="email"
              placeholder="someone@example.com"
              value={props.profile.email}
              // readOnly={!!props.profile.email}
              onChange={props.contactChangeHandler}
            />
          </Col>
        </FormGroup>
        <FormGroup row className="align-items-center">
          <Label xs={2} for="phone" className="text-right">
            Phone
          </Label>
          <Col xs={10}>
            <Input
              type="text"
              name="phone"
              placeholder="(201) 555-1212"
              value={props.profile.phone ? props.profile.phone : null}
              // readOnly={
              //   props.profile.phone
              //     ? !!props.profile.phone
              //     : false
              // }
              onChange={props.contactChangeHandler}
            />
          </Col>
        </FormGroup>
      </Form>
    </ModalDialog>
  );
};

export default ContactInfo;
