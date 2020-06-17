import React, { Component } from 'react'
import { Dialog, Button } from '@blueprintjs/core'
import robot from './robot.png'
import './styles.sass'

const PanelOne = ({ onClick, siteUrl }) => (
  <div className="panel-container">
    <h1>
      <span role="img" aria-label="Confetti">
        🎉
      </span>{' '}
      Welcome to blogwise!{' '}
      <span role="img" aria-label="Confetti">
        🎉
      </span>
    </h1>
    <img alt="Blogwise Robot" src={robot} />
    <p>
      Your blog is live! It's been set up based off of the information provided
      when you registered your account. You can access it{' '}
      <a target="_blank" rel="noopener noreferrer" href={siteUrl}>
        here
      </a>{' '}
      (Don't worry you can set it to go to a custom URL later).
    </p>
    <Button className="panel-button" large minimal onClick={onClick}>
      Got It!
    </Button>
  </div>
)

class WelcomeModal extends Component {
  constructor(props) {
    super(props)
    this.panels = [
      <PanelOne onClick={this.nextPanel(0)} siteUrl={props.siteUrl} />,
    ]
    this.state = {
      currentPanel: 0,
      isOpen: props.isOpen,
    }
  }
  nextPanel = i => () =>
    i + 1 >= this.panels.length
      ? this.setState({ isOpen: false })
      : this.setState({ currentPanel: i + 1 })

  render() {
    return (
      <Dialog
        isOpen={this.state.isOpen}
        onClose={this.props.handleClose}
        style={{ width: '750px', height: '600px' }}
      >
        <div id="welcomemodal-container">
          {this.panels[this.state.currentPanel]}
        </div>
      </Dialog>
    )
  }
}
export default WelcomeModal
