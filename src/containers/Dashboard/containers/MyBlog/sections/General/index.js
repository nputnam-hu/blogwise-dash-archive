import React, { Component } from 'react'
import { FormGroup } from '@blueprintjs/core'
import QuestionHint from '../../../../../../components/QuestionHint'
import CropImgUploader from '../../../../../../components/CropImgUploader'
import Client from '../../../../../../client'
import favIcon from './favIcon.svg'
import './styles.sass'
import BlueButton from '../../../../../../components/BlueButton'

class General extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      faviconPhotoUri: '',
      cropModalOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ faviconPhotoUri: blog.faviconPhotoUri })
    })
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  handlePhotoUploaded = async url => {
    this.setState({ faviconPhotoUri: url, cropModalOpen: false })
    await this.client.put('/blogs', {
      faviconPhotoUri: this.state.faviconPhotoUri,
    })
  }
  render() {
    return (
      <div id="generalmyblog-container">
        <div className="section-header myblog">
          <img src={favIcon} alt="Users" />
          <div style={{ width: '10px' }} />
          <h2>Favicon</h2>
          <QuestionHint
            title="Favicon"
            helperText="The favicon is the tiny icon displayed in your readers browser tabs. For best results use png or ico format."
          />
        </div>
        <FormGroup
          htmlFor="favicon"
          label=""
          helperText="For best results, please use a small (32px by 32px) png or ico asset"
        >
          {this.state.faviconPhotoUri && (
            <div>
              <img
                style={{
                  height: '35px',
                  marginTop: '5px',
                  marginBottom: '5px',
                }}
                src={this.state.faviconPhotoUri}
                alt="logo preview"
              />
              <br />
            </div>
          )}
          <BlueButton
            text="Choose file..."
            name="favicon"
            onClick={this.openCropModal}
          />
        </FormGroup>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.client}
          fileLabel="Favicon"
          onConfirmCrop={this.handlePhotoUploaded}
        />
      </div>
    )
  }
}

export default General
