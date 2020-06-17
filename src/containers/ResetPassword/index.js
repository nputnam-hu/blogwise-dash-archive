import React, { Component } from 'react'
import { InputGroup, FormGroup, Button, Intent } from '@blueprintjs/core'
import qs from 'qs'
import Client from '../../client'
import errorMessage, { validateState, alertUser } from '../../toaster'

class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    const { token, email } = qs.parse(props.location.search.slice(1))
    this.state = {
      password: '',
      passwordConfirm: '',
      token,
      email,
    }
    if (!token || !email) {
      return this.props.history.push('/forgotpassword')
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!validateState(['password', 'passwordConfirm'], this.state)) {
      return
    }
    if (this.state.password !== this.state.passwordConfirm) {
      errorMessage('Passwords do not match')
      return
    }
    try {
      await this.client.put('/auth/reset', {
        email: this.state.email,
        token: this.state.token,
        newPassword: this.state.password,
      })
      alertUser('Password Reset!')
      this.props.history.push('/login')
    } catch (err) {
      console.error(err)
      errorMessage(
        'Error resetting password, if this problem persists contact support',
      )
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
        <h2>Choose a New Password</h2>
        <div className="onboarding-form">
          <FormGroup htmlFor="password" label="Choose a Password">
            <InputGroup
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              placeholder="**********"
            />
          </FormGroup>
          <FormGroup htmlFor="passwordConfirm" label="Confirm Password">
            <InputGroup
              name="passwordConfirm"
              type="password"
              value={this.state.passwordConfirm}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              placeholder="**********"
            />
          </FormGroup>
          <br />
          <Button
            large
            rightIcon="arrow-right"
            onClick={this.onClick}
            intent={Intent.PRIMARY}
          >
            Reset Password
          </Button>
        </div>
      </div>
    )
  }
}

export default ResetPassword
