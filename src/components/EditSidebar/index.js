import React, { Component } from 'react'
import {
  FormGroup,
  InputGroup,
  TextArea,
  ControlGroup,
} from '@blueprintjs/core'
import normalizeUrl from 'normalize-url'
import CropImgUploader from '../CropImgUploader'
import './styles.sass'
import IndexPreview from '../IndexPreview'
import BlueButton from '../BlueButton'

class EditSidebar extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      description: '',
      mainSiteUrl: '',
      facebookUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      sidebarPhotoUri: '',
      companyName: '',
      tags: {},
      fetchingData: true,
      cropModalOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        description: blog.description || '',
        companyName: blog.companyName || '',
        mainSiteUrl: blog.mainSiteUrl || '',
        facebookUrl: blog.facebookUrl || '',
        twitterUrl: blog.twitterUrl || '',
        linkedinUrl: blog.linkedinUrl || '',
        sidebarPhotoUri: blog.sidebarPhotoUri || '',
        tags: blog.tags || {},
        fetchingData: false,
      })
    })
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () => {
    const sidebar = { ...this.state }
    try {
      sidebar.mainSiteUrl = normalizeUrl(sidebar.mainSiteUrl)
    } catch (e) {
      sidebar.mainSiteUrl = ''
    }
    this.props.onSubmit(sidebar)
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
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
  removeSidebarPhotoUri = () => this.setState({ sidebarPhotoUri: '' })
  render() {
    return (
      <>
        <div className="editheader">
          <div className="editheader__inputs">
            {this.props.topPart}
            <br />
            <FormGroup
              htmlFor="companyName"
              label="Company Name"
              helperText="The name you want readers to know your company by"
            >
              <InputGroup
                name="companyName"
                value={this.state.companyName}
                onChange={this.onChange}
                {...this.changeBgOnHover('companyName')}
              />
            </FormGroup>
            <br />
            <FormGroup htmlFor="sidebarimg" label="Sidebar Logo">
              <div className="imgupload">
                {this.state.sidebarPhotoUri && (
                  <>
                    <img
                      src={this.state.sidebarPhotoUri}
                      alt="logo preview"
                      id="sidebarimg-preview"
                      {...this.changeBgOnHover('sidebar')}
                    />
                    <button
                      onClick={this.removeSidebarPhotoUri}
                      className="cover__xbutton"
                      {...this.changeBgOnHover('sidebar')}
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
                  {...this.changeBgOnHover('sidebar')}
                />
              </div>
            </FormGroup>
            <br />
            <FormGroup htmlFor="description" label="Description">
              <TextArea
                name="description"
                value={this.state.description || ''}
                onChange={this.onChange}
                fill
                style={{ resize: 'none', height: '100px' }}
                {...this.changeBgOnHover('description')}
              />
            </FormGroup>
            <br />
            {/* <FormGroup
              htmlFor="mainSiteUrl"
              label="Website Link"
              helperText="A link to your primary website"
            >
              <InputGroup
                name="mainSiteUrl"
                value={this.state.mainSiteUrl}
                onChange={this.onChange}
              />
            </FormGroup> */}
            <FormGroup
              htmlFor="twitterUrl"
              label="Twitter URL"
              helperText="A link to your company's twitter account"
            >
              <ControlGroup>
                <span className="urlStart">twitter.com/</span>
                <InputGroup
                  name="twitterUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.twitterUrl}
                  onChange={this.onChange}
                  {...this.changeBgOnHover('twitter')}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="facebookUrl"
              label="Facebook URL"
              helperText="A link to your company's facebook page"
            >
              <ControlGroup>
                <span className="urlStart">facebook.com/</span>
                <InputGroup
                  name="facebookUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.facebookUrl}
                  onChange={this.onChange}
                  {...this.changeBgOnHover('facebook')}
                />
              </ControlGroup>
            </FormGroup>
            <FormGroup
              htmlFor="linkedinUrl"
              label="LinkedIn URL"
              helperText="A link to your company's LinkedIn Profile"
            >
              <ControlGroup>
                <span className="urlStart">linkedin.com/</span>
                <InputGroup
                  name="linkedinUrl"
                  style={{ paddingLeft: 2 }}
                  value={this.state.linkedinUrl}
                  onChange={this.onChange}
                  {...this.changeBgOnHover('linkedin')}
                />
              </ControlGroup>
            </FormGroup>
            <br />
            <button className="editheader__button" onClick={this.onClick}>
              {this.props.buttonText}
            </button>
          </div>
          <IndexPreview
            tags={Object.values(this.state.tags)}
            blogData={{
              logoUri: this.state.sidebarPhotoUri,
              description: this.state.description,
              twitterUrl: this.state.twitterUrl,
              facebookUrl: this.state.facebookUrl,
              linkedinUrl: this.state.linkedinUrl,
              name: this.state.companyName,
            }}
            idToScrollTo="companyName"
          />
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.cropModalOpen}
          handleClose={this.handleCropModalClose}
          client={this.props.client}
          fileLabel="Sidebar Photo"
          onConfirmCrop={url =>
            this.setState({ sidebarPhotoUri: url, cropModalOpen: false })
          }
        />
      </>
    )
  }
}

export default EditSidebar
