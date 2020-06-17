import React, { Component } from 'react'
import store from 'store'
import EditSidebar from '../../../components/EditSidebar'
import Client from '../../../client'
import errorMessage from '../../../toaster'

class Sidebar extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      const { siteUrl } = await this.client.put('/blogs', state)
      await this.client.post('/blogs/deploy')
      store.set('firstTime', true)
      this.props.history.push('/dashboard', {
        tabId: 'si',
        siteUrl,
      })
    } catch (err) {
      console.error(err)
      errorMessage('Error updating blog')
    }
  }
  onBackButtonClick = () => {
    this.props.history.push('/onboarding/2', { ...this.props.location.state })
  }
  render() {
    return (
      <EditSidebar
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
        client={this.client}
        buttonText="Finish Customizing Sidebar"
        topPart={
          <>
            <div className="onboarding-stepcounter">Step 3 of 3</div>
            <h2>Edit Your Homepage</h2>
            <span className="onboarding-subheader">
              Customize your blog's sidebar. Feel free to finish doing this
              later.
            </span>
          </>
        }
      />
    )
  }
}

export default Sidebar
