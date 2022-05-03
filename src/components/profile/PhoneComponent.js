import React from 'react';
import {Form, Input, Label, Button } from 'reactstrap';

export const PhoneComponent = ({ setPhone, editPhone, updatePhone, props }) => {
  let { isPhoneEdit, phone } = props;
  if (!isPhoneEdit) {
    return (
      <>
        <Label>{phone}</Label>
        <Button 
          color="primary"
          className="activation-btn"
           onClick={editPhone}>
          Edit
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Form onSubmit={setPhone}>
          <Input name="phone" type="tel" value={phone} onChange={updatePhone} />
          <Button
            color="info"
            type="button"
            className="activation-btn"
            onClick={editPhone}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="success"
            className="activation-btn">
            Save
          </Button>
        </Form>
      </>
    );
  }
};
