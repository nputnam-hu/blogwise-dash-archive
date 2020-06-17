import React from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { Dialog } from '@blueprintjs/core'
import BlueButton from '../../../../../components/BlueButton'
import './styles.sass'

const CreditCardModal = ({ isOpen, handleClose, stripe, handleFormSubmit }) => (
  <>
    <Dialog isOpen={isOpen} onClose={handleClose}>
      <div className="ccmodal">
        <form
          onSubmit={ev => {
            ev.preventDefault()
            handleFormSubmit(stripe)
          }}
        >
          <CardElement
            style={{
              base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
              },
            }}
          />
          <div className="ccmodal__bottom">
            <BlueButton id="confirm-button" type="submit" large>
              Confirm Card
            </BlueButton>
          </div>
        </form>
      </div>
    </Dialog>
  </>
)

export default injectStripe(CreditCardModal)
