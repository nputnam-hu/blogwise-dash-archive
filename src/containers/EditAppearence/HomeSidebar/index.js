import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import EditSidebar from '../../../components/EditSidebar'
import Client from '../../../client'
import errorMessage from '../../../toaster'

class HomeSidebar extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      await this.client.put('/blogs', state)
      this.props.history.push('/dashboard/myblog', {
        tabId: 'third',
      })
    } catch (err) {
      errorMessage('Failed to update blog')
    }
  }
  onBackButtonClick = () => {
    this.props.history.push('/dashboard/myblog', {
      tabId: 'third',
    })
  }
  render() {
    return (
      <EditSidebar
        client={this.client}
        onSubmit={this.onSubmit}
        buttonText="Save Changes"
        topPart={
          <Button
            small
            icon="arrow-left"
            className="editheader__backbutton"
            minimal
            onClick={this.onBackButtonClick}
          >
            Back to dashboard
          </Button>
        }
      />
    )
  }
}

export default HomeSidebar
