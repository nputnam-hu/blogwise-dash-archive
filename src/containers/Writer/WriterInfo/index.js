import React, { Component } from 'react'
import {
  FormGroup,
  FileInput,
  Button,
  TextArea,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import Client, { uploadFileToS3 } from '../../../client'
import './styles.sass'

class WriterInfo extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      headshotUri: '',
      bio: '',
      name: '',
    }
  }
  componentDidMount() {
    this.client.get('/users/me').then(user => {
      this.setState({
        headshotUri: user.headshotUri || '',
        bio: user.bio || '',
        name: user.name || '',
        id: user.id,
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () => {
    this.client.put('/users', { ...this.state }).then(() => {
      this.props.history.push('/writer')
    })
  }
  handleFileUpload = evt => {
    const { files } = evt.target
    const file = files[0]
    if (file) {
      uploadFileToS3(file, this.client).then(url =>
        this.handlePhotoUploaded(url.split('?')[0]),
      )
    }
  }

  handlePhotoUploaded = url => {
    this.setState({ headshotUri: url })
  }

  render() {
    return (
      <div className="onboarding-container writerinfo">
        <div className="onboarding-stepcounter">Step 2 of 2</div>
        <h2>Complete Your Profile</h2>
        <div id="writerinfo-container">
          <div id="writerinfo-user">
            <div id="headshot-preview">
              <img
                id="headshot-img"
                src={this.state.headshotUri}
                alt="User Headshot"
              />
              <FormGroup
                htmlFor="profile"
                label="Profile Photo"
                helperText="The profile photo will be shown in all article pages next to the writer's name"
              >
                <FileInput
                  name="profile"
                  text="Change image..."
                  onInputChange={this.handleFileUpload}
                />
              </FormGroup>
            </div>
            <div id="writerinfo-inputs">
              <FormGroup htmlFor="name" label="Name">
                <InputGroup
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                />
              </FormGroup>
              <FormGroup
                htmlFor="bio"
                label="Author Bio"
                helperText="The author bio will be displayed at the bottom of every article by this writer"
              >
                <TextArea
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  fill
                  style={{ resize: 'none' }}
                />
              </FormGroup>
            </div>
          </div>
          <Button
            intent={Intent.PRIMARY}
            id="confirm-button"
            onClick={this.onClick}
            rightIcon="arrow-right"
            large
          >
            Finish Registration
          </Button>
        </div>
      </div>
    )
  }
}

export default WriterInfo
