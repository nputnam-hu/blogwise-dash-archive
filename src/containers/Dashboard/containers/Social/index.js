import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import TwitterLogin from 'react-twitter-auth'
import Client from '../../../../client'
import './styles.sass'

class Social extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      twitterToken: '',
    }
  }
  onSuccess = response => {
    response.json().then(body => {
      alert(JSON.stringify(body))
    })
  }

  onFailed = error => {
    alert(error)
  }

  render() {
    return (
      <div className="social">
        <Button
          small
          icon="arrow-left"
          minimal
          onClick={() => this.props.history.push('/dashboard/postgenius')}
        >
          Back to Post Genius
        </Button>
        <h1>Social Accounts</h1>
        <TwitterLogin
          style={{ borderRadius: '10px', padding: '10px' }}
          loginUrl="http://localhost:4000/api/v1/auth/twitter"
          text="Connect twitter account"
          onFailure={this.onFailed}
          onSuccess={this.onSuccess}
          requestTokenUrl="http://localhost:4000/api/v1/auth/twitter/reverse"
          showIcon
          // customHeaders={customHeader}
        />
      </div>
    )
  }
}

export default Social
