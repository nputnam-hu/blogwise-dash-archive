import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  Popover,
  PopoverInteractionKind,
  RadioGroup,
  Radio,
} from '@blueprintjs/core'
import { ChromePicker as ColorPicker } from 'react-color'
import CropImgUploader from '../CropImgUploader'
import { uploadFileToS3 } from '../../client'
import './styles.sass'
import BlueButton from '../BlueButton'
import IndexPreview from '../IndexPreview'

function getColorByBgColor(bgColor) {
  if (!bgColor) {
    return ''
  }
  return parseInt(bgColor.replace('#', ''), 16) > 0xffffff / 2 ? '#000' : '#fff'
}

class EditHeader extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      title: '',
      headerPhotoUri: '',
      backgroundHexCode: '',
      bgImgUri: '',
      navbarHexCode: '',
      headerTextColor: '',
      cropModalOpen: '',
      bgCropModalOpen: '',
      fetchingData: '',
      bgType: 'color',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        title: blog.title,
        headerPhotoUri: blog.headerPhotoUri,
        bgImgUri: blog.bgImgUri,
        bgType: blog.bgImgUri ? 'img' : 'color',
        backgroundHexCode: blog.backgroundHexCode,
        navbarHexCode: blog.navbarHexCode,
        headerTextColor: blog.headerTextColor,
        fetchingData: false,
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  changeBgOnHover = id => ({
    onMouseEnter: () => {
      const el = document.getElementById(id)
      if (!el) return
      el.classList.add('hoverpreview')
    },
    onMouseLeave: () => {
      const el = document.getElementById(id)
      if (!el) return
      el.classList.remove('hoverpreview')
    },
  })
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
    this.setState({ headerPhotoUri: url })
  }
  handleColorPicked = ({ hex }) => {
    const newState = { backgroundHexCode: hex, bgImgUri: '' }
    newState.headerTextColor = getColorByBgColor(hex)
    this.setState(newState)
  }
  handleTextColorPicked = ({ hex }) => this.setState({ headerTextColor: hex })
  handleBgTypeChange = e => this.setState({ bgType: e.currentTarget.value })
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  openBgCropModal = () => this.setState({ bgCropModalOpen: true })
  handleBgCropModalClose = () => this.setState({ bgCropModalOpen: false })
  removeHeaderPhotoUri = () => this.setState({ headerPhotoUri: '' })
  removeBgImgUri = () => this.setState({ bgImgUri: '' })
  render() {
    return (
      <div className="editheader">
        <div className="editheader__inputs" id="editheader__inputs">
          {this.props.topPart}
          <br />
          <FormGroup htmlFor="title" label="Blog Title">
            <InputGroup
              name="title"
              value={this.state.title}
              onChange={this.onChange}
              className="titleinput"
              {...this.changeBgOnHover('headertext')}
              autoFocus
            />
          </FormGroup>
          <br />
          <FormGroup
            htmlFor="headerTextColor"
            label="Title Text Color"
            className="colorlabel"
          >
            <div className="colorinput">
              <div
                className="colorpreview"
                style={{ background: this.state.headerTextColor }}
              />
              <Popover interactionKind={PopoverInteractionKind.CLICK}>
                <BlueButton {...this.changeBgOnHover('headertext')}>
                  Change
                </BlueButton>
                <ColorPicker
                  name="color"
                  color={this.state.headerTextColor}
                  onChange={this.handleTextColorPicked}
                />
              </Popover>
            </div>
          </FormGroup>
          <br />
          <FormGroup htmlFor="headerimg" label="Logo">
            <div className="imgupload">
              {this.state.headerPhotoUri && (
                <>
                  <img
                    src={this.state.headerPhotoUri}
                    alt="logo preview"
                    id="headerimg-preview"
                    {...this.changeBgOnHover('headerimg')}
                  />
                  <button
                    onClick={this.removeHeaderPhotoUri}
                    className="cover__xbutton"
                    {...this.changeBgOnHover('headerimg')}
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
                {...this.changeBgOnHover('headerimg')}
              />
            </div>
          </FormGroup>
          <br />
          <br />
          <FormGroup label="Background" htmlFor="background">
            <div name="background">
              <RadioGroup
                onChange={this.handleBgTypeChange}
                selectedValue={this.state.bgType}
                inline
              >
                <Radio label="Solid Color" value="color" />
                <Radio label="Background Image" value="img" />
              </RadioGroup>
            </div>
          </FormGroup>
          {this.state.bgType === 'color' ? (
            <FormGroup htmlFor="color">
              <div className="colorinput">
                <div
                  className="colorpreview"
                  style={{ background: this.state.backgroundHexCode }}
                />
                <Popover interactionKind={PopoverInteractionKind.CLICK}>
                  <BlueButton {...this.changeBgOnHover('headercontainer')}>
                    Change
                  </BlueButton>
                  <ColorPicker
                    name="color"
                    color={this.state.backgroundHexCode}
                    onChange={this.handleColorPicked}
                  />
                </Popover>
              </div>
            </FormGroup>
          ) : (
            <FormGroup htmlFor="bgimg">
              <div className="imgupload">
                {this.state.bgImgUri && (
                  <>
                    <img
                      src={this.state.bgImgUri}
                      alt="logo preview"
                      id="headerimg-preview"
                    />
                    <button
                      onClick={this.removeBgImgUri}
                      className="cover__xbutton"
                      {...this.changeBgOnHover('headercontainer')}
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
                  name="bgimg"
                  icon="upload"
                  onClick={this.openBgCropModal}
                  {...this.changeBgOnHover('headercontainer')}
                />
              </div>
            </FormGroup>
          )}
          <br />
          <br />
          <button
            id="editheader__button"
            className="editheader__button"
            onClick={() => this.props.onSubmit(this.state)}
          >
            {this.props.buttonText}
          </button>
        </div>
        <IndexPreview
          blogData={{
            title: this.state.title,
            headerPhotoUri: this.state.headerPhotoUri,
            bgImgUri: this.state.bgImgUri,
            backgroundHexCode: this.state.backgroundHexCode,
            headerTextColor: this.state.headerTextColor,
          }}
        />
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.client}
          fileLabel="Header Photo"
          onConfirmCrop={url =>
            this.setState({ headerPhotoUri: url, cropModalOpen: false })
          }
        />
        <CropImgUploader
          isOpen={this.state.bgCropModalOpen}
          handleClose={this.handleBgCropModalClose}
          client={this.client}
          fileLabel="Background Image"
          onConfirmCrop={url =>
            this.setState({ bgImgUri: url, bgCropModalOpen: false })
          }
        />
      </div>
    )
  }
}

export default EditHeader
