import React, { Component } from 'react'
import {
  Dialog,
  FormGroup,
  InputGroup,
  TextArea,
  HTMLSelect,
  Button,
  Intent,
} from '@blueprintjs/core'
import CropImgUploader from '../CropImgUploader'
import Client from '../../client'
import './styles.sass'

class EditModal extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    this.state = {
      name: '',
      type: '',
      bio: '',
      headshotUri: '',
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ type: e.currentTarget.value })
  onClick = () => {
    this.client
      .put('/users', { ...this.state, id: this.props.user.id })
      .then(this.props.handleSave)
  }

  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  render() {
    const { isOpen, handleClose } = this.props
    return (
      <>
        <Dialog
          icon="user"
          isOpen={isOpen}
          onClose={handleClose}
          title="Update User"
          style={{ width: '750px' }}
          onOpening={() =>
            this.setState({
              name: this.props.user.name,
              type: this.props.user.type,
              bio: this.props.user.bio,
              headshotUri: this.props.user.headshotUri,
            })
          }
        >
          <div id="editmodal-container">
            <div id="editmodal-user">
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
                  <Button
                    text="Choose file..."
                    name="profile"
                    onClick={this.openCropModal}
                  />
                </FormGroup>
              </div>
              <div id="editmodal-inputs">
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
                <FormGroup htmlFor="role" label="Role">
                  <HTMLSelect
                    name="role"
                    onChange={this.onSelectChange}
                    value={this.state.type}
                    options={[
                      { label: 'Writer', value: 'WRITER' },
                      { label: 'Admin', value: 'ADMIN' },
                    ]}
                  />
                </FormGroup>
              </div>
            </div>
            <Button
              intent={Intent.PRIMARY}
              id="confirm-button"
              onClick={this.onClick}
              large
            >
              Save User
            </Button>
          </div>
        </Dialog>
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.client}
          fileLabel="Headshot Photo"
          aspectRatio={1 / 1}
          onConfirmCrop={url =>
            this.setState({ headshotUri: url, cropModalOpen: false })
          }
        />
      </>
    )
  }
}

export default EditModal
