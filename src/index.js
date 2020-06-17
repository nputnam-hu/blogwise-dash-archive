/* eslint-disable import/extensions */
import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import './all.sass'
import 'typeface-rubik'
import 'typeface-pt-sans'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css'
import 'react-quill/dist/quill.snow.css'

import App from './App'
import * as serviceWorker from './serviceWorker'

Sentry.init({
  dsn:
    process.env.NODE_ENV === 'production' &&
    'https://8d3f8ad92f7b4a66a8d66d35a54c2b01@sentry.io/1427503',
})

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
