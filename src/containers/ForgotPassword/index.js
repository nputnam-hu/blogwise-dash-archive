import React, { Component } from 'react'
import { FormGroup, InputGroup, Button, Intent } from '@blueprintjs/core'
import Client from '../../client'
import errorMessage, { alertUser, validateState } from '../../toaster'
import './styles.sass'

class ForgotPassword extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      email: '',
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!validateState(['email'], this.state)) {
      return
    }
    try {
      await this.client.post('/auth/forgot', { email: this.state.email })
      alertUser('Email sent - check your inbox')
    } catch (err) {
      let msg
      switch (err.error.code) {
        case 5001:
          msg = 'No user with that email was found'
          break
        case 1007:
          msg = 'This link has expired: please send a new forgot password link'
          break
        default:
          msg = 'There was a problem reseting your password'
          break
      }
      errorMessage(msg)
    }
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.onClick()
    }
  }
  render() {
    return (
      <div className="onboarding-container">
        <Button
          small
          icon="arrow-left"
          className="onboarding-backbutton"
          minimal
          onClick={() => this.props.history.push('/login')}
        >
          Back
        </Button>
        <h2>Reset Password</h2>
        {/* <span className="onboarding-subheader">
          Fill in your email below and we'll send you a link to create a new
          password.
        </span> */}
        <div className="onboarding-form">
          <h3>
            Email support@blogwise.co from the email you signed up with, and
            we'll send you a link
          </h3>
          {/* <FormGroup htmlFor="email" label="Email">
            <InputGroup
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              placeholder="steve@apple.com"
            />
          </FormGroup>
          <br />
          <Button
            icon="envelope"
            onClick={this.onClick}
            intent={Intent.PRIMARY}
          >
            Send Email
          </Button> */}
        </div>
      </div>
    )
  }
}

export default ForgotPassword
