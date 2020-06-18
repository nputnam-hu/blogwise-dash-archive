/* eslint-disable prefer-destructuring */
import React, { Component } from 'react'
import { TwitterPicker } from 'react-color'
import {
  FormGroup,
  InputGroup,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core'
import uuid from 'uuid/v4'
import errorMessage, { validateState } from '../../../toaster'
import BlueButton from '../../../components/BlueButton'
import CropImgUploader from '../../../components/CropImgUploader'
import Client from '../../../client'
import lowerSwoosh from '../Register/lower_swoosh.png'
import upperSwoosh from '../Register/upper_swoosh.png'
import girlPainting from '../Register/girl_painting.png'
import './styles.sass'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

class GetInfo extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      companyName: '',
      headerPhotoUri: '',
      tagName: '',
      backgroundHexCode: '#ffffff',
      cropModalOpen: false,
    }
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onRadioChange = e => this.setState({ surveyAnswer: e.target.value })
  onClick = async () => {
    if (
      !validateState(
        [
          ['companyName', 'Organization Name'],
          ['tagName', 'Topic'],
        ],
        this.state,
      )
    ) {
      return
    }
    try {
      let companyName
      let title = 'Your Title Here'
      let headerPhotoUri
      let sidebarPhotoUri
      let backgroundHexCode
      let headerTextColor
      if (this.state.companyName) {
        companyName = this.state.companyName
        title = `${this.state.companyName}’s Blog`
      }
      if (this.state.headerPhotoUri) {
        headerPhotoUri = this.state.headerPhotoUri
        sidebarPhotoUri = this.state.headerPhotoUri
      }
      if (this.state.backgroundHexCode) {
        backgroundHexCode = this.state.backgroundHexCode
        headerTextColor = getColorByBgColor(this.state.backgroundHexCode)
      }
      await this.client.put('/blogs', {
        companyName,
        headerPhotoUri,
        sidebarPhotoUri,
        backgroundHexCode,
        headerTextColor,
        title,
        tags: {
          [uuid()]: {
            name: this.state.tagName,
            description: '',
          },
        },
      })
      this.props.history.push('/onboarding/2')
    } catch (err) {
      errorMessage(
        'Unable to update blog at this time. If this problem persists, please let us know via the chatbox on the bottom right of the screen.',
      )
    }
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.onClick()
    }
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  handleColorPicked = ({ hex }) => this.setState({ backgroundHexCode: hex })

  render() {
    return (
      <>
        <div className="getinfo">
          <img src={upperSwoosh} alt="Upper Swoosh" id="upperswoosh-img" />
          <img src={girlPainting} alt="Woman Painting" id="girlpainting-img" />
          <div className="onboarding-container getinfo__container">
            <div className="onboarding-stepcounter">Step 2 of 3</div>
            <h2>Answer a Few Questions</h2>
            <span className="onboarding-subheader">
              Give us some basic information and we'll build your initial blog
              for you
            </span>
            <div className="onboarding-form">
              <FormGroup
                htmlFor="companyName"
                label="What is your organization's name?"
              >
                <InputGroup
                  name="companyName"
                  value={this.state.companyName}
                  onChange={this.onChange}
                  placeholder="Example Inc."
                />
              </FormGroup>
              <br />
              <FormGroup
                htmlFor="tagName"
                label="What is a topic you're interested in?"
              >
                <InputGroup
                  name="tagName"
                  value={this.state.tagName}
                  onChange={this.onChange}
                  placeholder="Marketing"
                />
              </FormGroup>
              <br />
              <FormGroup
                htmlFor="headerPhotoUri"
                label="Do you have a logo to upload?"
              >
                <div className="imgupload">
                  {this.state.headerPhotoUri && (
                    <>
                      <img
                        src={this.state.headerPhotoUri}
                        alt="logo preview"
                        id="headerimg-preview"
                      />
                      <button
                        onClick={this.removeHeaderPhotoUri}
                        className="cover__xbutton"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 1.625C5.364 1.625 0 6.82137 0 13.25C0 19.6786 5.364 24.875 12 24.875C18.636 24.875 24 19.6786 24 13.25C24 6.82137 18.636 1.625 12 1.625ZM11.9999 22.5499C6.70793 22.5499 2.39993 18.3766 2.39993 13.2499C2.39993 8.12332 6.70793 3.94994 11.9999 3.94994C17.2919 3.94994 21.5999 8.12332 21.5999 13.2499C21.5999 18.3766 17.2919 22.5499 11.9999 22.5499ZM12 11.6109L16.308 7.4375L18 9.07662L13.692 13.25L18 17.4234L16.308 19.0625L12 14.8891L7.692 19.0625L6 17.4234L10.308 13.25L6 9.07662L7.692 7.4375L12 11.6109Z"
                            fill="#C4C4C4"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                  <BlueButton
                    text="Choose file..."
                    icon="upload"
                    onClick={this.openCropModal}
                  />
                </div>
              </FormGroup>
              <br />
              <FormGroup
                htmlFor="backgroundHexCode"
                label="Which color best matches your organization's brand?"
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div
                    className="colorpreview"
                    style={{
                      background: this.state.backgroundHexCode,
                      marginRight: '15px',
                    }}
                  />
                  <Popover interactionKind={PopoverInteractionKind.CLICK}>
                    <BlueButton>Choose Color</BlueButton>
                    <TwitterPicker
                      triangle="hide"
                      name="backgroundHexCode"
                      color={this.state.backgroundHexCode}
                      onChange={this.handleColorPicked}
                    />
                  </Popover>
                </div>
              </FormGroup>
              <br />
              <div style={{ alignSelf: 'center' }}>
                <BlueButton rightIcon="arrowRightLarge" onClick={this.onClick}>
                  Next Step
                </BlueButton>
              </div>
            </div>
          </div>
          <img src={lowerSwoosh} alt="Lower Swoosh" id="lowerswoosh-img" />
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.client}
          fileLabel="Logo"
          onConfirmCrop={url =>
            this.setState({ headerPhotoUri: url, cropModalOpen: false })
          }
        />
      </>
    )
  }
}

export default GetInfo
