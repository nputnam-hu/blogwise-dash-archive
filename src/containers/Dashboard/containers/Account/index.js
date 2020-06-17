import React, { Component } from 'react'
import { Spinner, Alert, Intent } from '@blueprintjs/core'
import moment from 'moment'
import Client from '../../../../client'
import PricingCardGrid from './PricingCardGrid'
import BlueButton from '../../../../components/BlueButton'
import CreditCardModal from './CreditCardModal'
import errorMessage, { alertUser } from '../../../../toaster'
import './styles.sass'

const upperFirst = str => str && `${str[0].toUpperCase()}${str.slice(1)}`

class Account extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      dataLoading: true,
      modalOpen: false,
      email: '',
      name: '',
      plan: '',
      lastFour: '',
      brand: '',
      invoices: [],
      trialDaysLeft: null,
      ccModalOpen: false,
      alertOpen: false,
    }
  }
  componentDidMount() {
    this.client
      .get('/organizations')
      .then(org => {
        this.client.get('/users/me').then(user => {
          this.setState({
            plan: org.plan || '',
            trialDaysLeft: org.trialDaysLeft,
            brand: org.brand,
            lastFour: org.lastFour,
            invoices: org.invoices,
            email: user.email,
            name: user.name,
            dataLoading: false,
          })
        })
      })
      .catch(() => this.setState({ plan: 'invalid', dataLoading: false }))
  }
  updatePlan = plan => () => {
    this.setState({ planToUpdate: plan, alertOpen: true })
  }
  closeAlert = () => this.setState({ alertOpen: false, planToUpdate: '' })
  confirmAlert = async () => {
    try {
      const { plan } = await this.client.put('/organizations/plans', {
        plan: this.state.planToUpdate,
      })
      this.setState({ planToUpdate: '', plan })
    } catch (err) {
      errorMessage(
        'Could not change plan at this time, if this problem continues contact support',
      )
    }
  }
  openCcModal = () => this.setState({ ccModalOpen: true })
  closeCcModal = () => this.setState({ ccModalOpen: false })
  submitCcForm = async stripe => {
    try {
      const { error, token } = await stripe.createToken({
        type: 'card',
        owner: {
          name: this.state.name,
          email: this.state.email,
        },
      })
      if (error) {
        console.error(error)
        return
      }
      const { lastFour, brand } = await this.client.put(
        '/organizations/creditcard',
        { source: token.id },
      )
      alertUser('Card Added')
      this.setState({ lastFour, brand })
      this.closeCcModal()
    } catch (err) {
      errorMessage('Error adding card: make sure it is valid')
    }
  }
  render() {
    const plan = this.state.plan.toLowerCase()
    const hasCC = Boolean(this.state.lastFour)
    console.log(this.state.brand, this.state.lastFour)
    return (
      <>
        <div id="account-container">
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="account__card">
                <h2>Payment</h2>
                {/* <div className="account__row">
                  <span style={{ alignSelf: 'center' }}>Name</span>
                  <span style={{ alignSelf: 'center' }}>{this.state.name}</span>
                </div>
                <div className="account__row">
                  <span style={{ alignSelf: 'center' }}>Email</span>
                  <span style={{ alignSelf: 'center' }}>
                    {this.state.email}
                  </span>
                </div> */}
                <div className="account__row">
                  <span style={{ alignSelf: 'center' }}>Credit Card</span>
                  <div className="paymentrow">
                    <span className="paymentrow__info">
                      {hasCC ? (
                        <>
                          <b>{this.state.brand}</b> •••• •••• ••••{' '}
                          {this.state.lastFour}
                        </>
                      ) : (
                        'No card saved'
                      )}
                    </span>
                    <BlueButton onClick={this.openCcModal}>
                      {hasCC ? 'Change' : 'Add'}
                    </BlueButton>
                  </div>
                </div>
                <div style={{ height: '40px' }} />
                {this.state.invoices.length > 0 && (
                  <div className="account__row">
                    <span>Invoices</span>
                    <table className="bp3-html-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount Due</th>
                          <th>Download PDF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.invoices.map(invoice => (
                          <tr key={invoice.invoicePdf}>
                            <td>
                              {moment(invoice.dueDate).format('MM/DD/YYYY')}
                            </td>
                            <td>${(invoice.amountDue / 100).toFixed(2)}</td>
                            <td>
                              <a
                                href={invoice.invoicePdf}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div style={{ height: '40px' }} />
              <div className="account__bottom">
                {this.state.trialDaysLeft && !hasCC ? (
                  <>
                    <h2 className="plan__header">
                      You have
                      <b> {this.state.trialDaysLeft} </b> days left on your
                      trial for the Starter Plan
                    </h2>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '20px',
                      }}
                    >
                      <BlueButton onClick={this.openCcModal}>
                        Add Card to Continue Past Trial
                      </BlueButton>
                    </div>
                  </>
                ) : (
                  <span>
                    Your account is on the <br />
                    <h2 className="plan__header">{upperFirst(plan)} Plan</h2>
                  </span>
                )}
              </div>
              <PricingCardGrid
                updatePlan={this.updatePlan}
                activePlan={this.state.plan}
                onTrial={Boolean(this.state.trialDaysLeft)}
              />
            </>
          )}
        </div>
        {/* Modals */}
        <CreditCardModal
          isOpen={this.state.ccModalOpen}
          handleClose={this.closeCcModal}
          handleFormSubmit={this.submitCcForm}
        />
        <Alert
          isOpen={this.state.alertOpen}
          onClose={this.closeAlert}
          onCancel={this.closeAlert}
          onConfirm={this.confirmAlert}
          cancelButtonText="Cancel"
          confirmButtonText="Change Plan"
          intent={Intent.PRIMARY}
        >
          <p>
            Are you sure you want to change plans? If upgrading, you will be
            charged a pro-rated amount for this billing period.
          </p>
        </Alert>
      </>
    )
  }
}

export default Account
