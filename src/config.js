import moment from 'moment'

export default {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  stripeToken:
    process.env.REACT_APP_STRIPE_TOKEN || 'pk_test_PLYBUJIxJHsPDp2WbHj90s4S',
  logoutTime: () =>
    moment()
      .add(1, 'days')
      .valueOf(),
}
