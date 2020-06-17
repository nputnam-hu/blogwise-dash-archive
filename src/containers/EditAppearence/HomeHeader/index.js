import React, { Component } from 'react'
import { Button } from '@blueprintjs/core'
import EditHeader from '../../../components/EditHeader'
import Client from '../../../client'
import errorMessage from '../../../toaster'

class HomeHeader extends Component {
  constructor() {
    super()
    this.client = new Client()
  }
  onSubmit = async state => {
    try {
      await this.client.put('/blogs', {
        title: state.title,
        headerPhotoUri: state.headerPhotoUri,
        backgroundHexCode: state.backgroundHexCode,
        bgImgUri: state.bgImgUri,
        navbarHexCode: state.navbarHexCode,
        headerTextColor: state.headerTextColor,
      })
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
      <EditHeader
        client={this.client}
        onSubmit={this.onSubmit}
        onBackButtonClick={this.onBackButtonClick}
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

export default HomeHeader
