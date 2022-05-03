import React, { Component } from 'react';
import { ReactMultiEmailCustom } from 'react-multi-email-custom';
import 'react-multi-email-custom/style.css';
import { Label, Button } from 'reactstrap';

require('./css/multiSelectInput.css');

class MultiSelectInput extends Component {
  render() {
    return (
      <ReactMultiEmailCustom
        emails={this.props.emails}
        onChange={_emails => {
          this.props.onChange(_emails);
        }}
        id={this.props.id}
        name={this.props.name}
        getLabel={(email, index, removeEmail) => {
          return (
            <Label key={index} className="email-text-wrapper">
              {email}
              <span
                className="delete"
                name="delete"
                onClick={() => removeEmail(index)}
              >
                X
              </span>
            </Label>
          );
        }}
      />
    );
  }
}

export default MultiSelectInput;
