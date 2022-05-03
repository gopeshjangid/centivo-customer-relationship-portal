import React from 'react';
import { Input, FormFeedback, Label, InputGroupAddon, InputGroup } from 'reactstrap';

const renderTextField = ({
  input,
  label,
  type,
  name,
  className,
  placeholder,
  cRequired,
  meta: { touched, error, warning },
  children
}) => {

  const validError = (touched && error) || warning ? true : false;
  return (
    <>
      {label ? <Label for={name} className="form-label">{
        label}
        {
          cRequired ? <span className="text-error">*</span> : null
        }
      </Label> : null}

      <InputGroup>
        { children }
        <Input
          type={type}
          placeholder={placeholder}
          invalid={validError}
          className={className}
          maxLength={100}
          autoFocus={label == 'Username' ? true : false}
          {...input}
        />
        
      </InputGroup>
      <FormFeedback valid={!validError} className="text-left">
        {(
          <span>
            <i className="icon icon-error-info" /> {label + ' ' + error}
          </span>
        ) || <span>{warning}</span>}
      </FormFeedback>
    </>
  );
};

export default renderTextField;
