import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Form, Button, FormGroup, InputGroupAddon } from 'reactstrap';
import { renderTextField } from './../wrapper';
import { _global, validation } from './../../helpers'
import { Auth } from 'aws-amplify';
import { keyConstants } from './../../constants'

class LoginForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }

    sessionStorage.removeItem('sessionTimeOut');
    sessionStorage.removeItem('_sessionToken');
    sessionStorage.removeItem('param');
  }

  onInputChange = event => {
    const { name, value } = event.currentTarget;
    this.setState({
      [name]: value
    })
  }

  handleSubmit = e => {
    sessionStorage._sessionToken = '';
    sessionStorage.setItem('loginClient', 'cognito');
    const { username, password } = this.state;
    if (username && password) {
      this.props.getLoginRequest();
      Auth.signIn(username, password)
        .then(user => {
          this.props.getLoginSuccess(user)
          this.props.getUserInfo()
        })
        .catch(err => {
          this.props.getLoginFailure(err);
        });
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const handleEnterKeyPress = e => {
      if (e.charCode === keyConstants.ENTER) {
        this.handleSubmit(_global.submit);
      }
    };

    return (
      <Form name="LoginForm" onSubmit={handleSubmit(_global.submit)} className="input-custom margin-top-20" onKeyPress={handleEnterKeyPress}>
        <FormGroup>
          <Field
            name="username"
            label="Email"
            placeholder="Enter Username"
            component={renderTextField}
            type="text"
            className="custom-input"
            onChange={this.onInputChange}
            validate={validation.required}
            dummy="dsfsdf"
          >
            <InputGroupAddon addonType="prepend">
              <span className="input-group-text">
              <i className="icon icon-mailGray" />
              </span>
            </InputGroupAddon>
          </Field>
        </FormGroup>
        <FormGroup>

          <Field
            name="password"
            label="Password"
            placeholder="Enter Password"
            component={renderTextField}
            onChange={this.onInputChange}
            type="password"
            className="custom-input custom-input-password"
            validate={validation.required}
          >
            <InputGroupAddon addonType="prepend">
                <span className="input-group-text">
                  <i className="icon icon-lock" />
                </span>
              </InputGroupAddon>
            </Field>
        </FormGroup>

        {this.props.authFailed ? (<div className="error text-left">{this.props.authFailed}</div>) : null}
        <FormGroup>
          <Button
            type="button"
            color="info"
            className="custom-round-btn"
            onClick={this.handleSubmit}
            disabled={!(this.state.username.trim().length > 0 && this.state.password.trim().length > 0)}
          >
            <i className="icon icon-unlock" /> Login
            </Button>
        </FormGroup>
      </Form>
    )
  }
}


LoginForm = reduxForm({
  form: 'login',
})(LoginForm);

export default LoginForm;
