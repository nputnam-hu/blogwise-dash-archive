import React, { Component } from 'react'
import { Tabs, Tab } from '@blueprintjs/core'
import Users from './sections/Users'
import Tags from './sections/Tags'
import Appearence from './sections/Appearence'
import DomainSettings from './sections/DomainSettings'
import General from './sections/General'
import './styles.sass'

class MyBlog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabId: (props.location.state && props.location.state.tabId) || 'first',
    }
  }
  handleTabChange = tabId => {
    this.setState({ tabId })
  }
  render() {
    return (
      <div id="myblog-container">
        <Tabs
          id="myblog-tabs"
          onChange={this.handleTabChange}
          selectedTabId={this.state.tabId}
          vertical
          large
          animate={false}
        >
          <Tab id="first" title="Users & Roles" panel={<Users />} />
          <Tab id="second" title="Tags" panel={<Tags />} />
          <Tab id="third" title="Appearance" panel={<Appearence />} />
          <Tab id="fourth" title="Domain Settings" panel={<DomainSettings />} />
          <Tab id="fifth" title="Favicon" panel={<General />} />
        </Tabs>
      </div>
    )
  }
}
export default MyBlog
