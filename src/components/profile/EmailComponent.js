import React from 'react';
import {Label, Input, Button, Form } from 'reactstrap';

export const EmailComponent = ({
  setEmailId,
  editEmail,
  updateEmail,
  props
}) => {
  let { isEmailEdit, emailId } = props;

  if (!isEmailEdit) {
    return (
      <>
        <Label>{emailId}</Label>
        <Button 
          color="primary"
          className="activation-btn"
          onClick={editEmail}>
          Edit
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Form onSubmit={setEmailId}>
          <Input
            name="emailId"
            type="email"
            value={emailId}
            onChange={updateEmail}
          />
          <Button
            color="info"
            className="activation-btn"
            onClick={editEmail}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            color="primary"
            className="activation-btn"
            >
              Save
          </Button>
        </Form>
      </>
    );
  }
};
