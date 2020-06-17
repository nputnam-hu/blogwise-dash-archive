import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { Button } from '@blueprintjs/core'
import Client from '../../../../client'

class PaymentDash extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/organizations').then(org => {
      this.setState({ dataLoading: false, stripeToken: org.stripeToken })
    })
  }
  render() {
    return (
      <div style={{ minHeight: '70vh' }}>
        <Button
          minimal
          icon="arrow-left"
          onClick={() => this.props.history.push('/dashboard/account')}
        >
          Back to Account
        </Button>
        <br />
        <CardElement />
      </div>
    )
  }
}

export default injectStripe(PaymentDash)
