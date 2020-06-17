import React, { Component } from 'react'
import { FormGroup, InputGroup } from '@blueprintjs/core'
import store from 'store'
import errorMessage, { validateState } from '../../toaster'
import Client from '../../client'
import config from '../../config'
import './styles.sass'
import BlueButton from '../../components/BlueButton'

class Login extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      email: '',
      password: '',
    }
  }
  componentDidMount() {
    const user = store.get('user')
    if (user && user.token) {
      if (user.type === 'ADMIN') {
        this.props.history.push('/dashboard')
      } else {
        this.props.history.push('/writer')
      }
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = async () => {
    if (!validateState(['email', 'password'], this.state)) {
      return
    }
    try {
      const user = await this.client.post('/auth/login', { ...this.state })
      store.set('user', user)
      await store.set('sessionExpires', config.logoutTime())
      if (user.type === 'ADMIN') {
        this.props.history.push('/dashboard')
      } else {
        this.props.history.push('/writer')
      }
    } catch (err) {
      errorMessage('Failed to log in, check your email and password')
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
        <h2>Login to Your Account</h2>
        <div className="onboarding-form login">
          <FormGroup htmlFor="email" label="Email">
            <InputGroup
              name="email"
              value={this.state.email}
              onChange={this.onChange}
              placeholder="steve@apple.com"
            />
          </FormGroup>
          <FormGroup htmlFor="password" label="Password">
            <InputGroup
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              placeholder="**********"
              className="login__textinput"
            />
          </FormGroup>
          <br />
          <BlueButton
            large
            rightIcon="arrowRight"
            onClick={this.onClick}
            className="login__button"
          >
            Login
          </BlueButton>
          <button
            onClick={() => this.props.history.push('/forgotpassword')}
            className="onboarding-setuplater"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    )
  }
}

export default Login
