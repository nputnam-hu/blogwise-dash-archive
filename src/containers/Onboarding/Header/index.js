import React, { Component } from 'react'
import EditHeader from '../../../components/EditHeader'
import Client from '../../../client'
import errorMessage from '../../../toaster'
import EditorOnboardingModal from '../../../components/EditorOnboardingModal'

class Header extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      await this.client.put('/blogs', {
        title: state.title,
        headerPhotoUri: state.headerPhotoUri,
        sidebarPhotoUri: state.headerPhotoUri,
        backgroundHexCode: state.backgroundHexCode,
        bgImgUri: state.bgImgUri,
        navbarHexCode: state.navbarHexCode,
        headerTextColor: state.headerTextColor,
      })
      this.props.history.push('/onboarding/3')
    } catch (err) {
      errorMessage('Failed to update blog')
    }
  }
  onBackButtonClick = () => {
    this.props.history.push('/plans', {
      ...this.props.location.state,
      ...this.state,
    })
  }
  render() {
    return (
      <>
        <EditorOnboardingModal />
        <EditHeader
          client={this.client}
          onSubmit={this.onSubmit}
          onBackButtonClick={this.onBackButtonClick}
          buttonText="Finish Customizing Header"
          topPart={
            <>
              <div className="onboarding-stepcounter">Step 3 of 3</div>
              <h2>Edit Your Homepage</h2>
              <span className="onboarding-subheader">
                Customize your blog's home page. Feel free to finish doing this
                later.
              </span>
            </>
          }
        />
      </>
    )
  }
}

export default Header
