import React, { Component } from 'react'
import moment from 'moment'
import { InputGroup, FormGroup, TextArea, Spinner } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import Select from 'react-select'
import ReactQuill, { Quill } from 'react-quill'
import { ImageResize } from 'quill-image-resize-module'
import { Template1Canonical } from 'blogwise-article-view'
import CropImgUploader from '../../../components/CropImgUploader'
import PostNavbar from './PostNavbar'
import EditPostView from './EditPostView'
import NewDraftModal from './NewDraftModal'
import UnsavedChangesModal from './UnsavedChangesModal'
import SchedulePostModal from './SchedulePostModal'
import UnsplashModal from './UnsplashModal'
import Client from '../../../client'
import BlueButton from '../../../components/BlueButton'
import errorMessage, { validateState, alertUser } from '../../../toaster'
import './styles.sass'

const HTMLContent = ({ content, className }) => (
  <div className={className} dangerouslySetInnerHTML={{ __html: content }} />
)

Quill.register('modules/imageResize', ImageResize)

class NewPost extends Component {
  constructor(props) {
    super(props)
    this.client = new Client()
    if (!props.match.params.id) {
      return props.history.push('/dashboard/myposts')
    }
    this.state = {
      title: '',
      coverPhotoUri: '',
      thumbnailUri: '',
      description: '',
      htmlBody: '',
      tags: [],
      author: '',
      publishDate: null,
      scheduledPublishDate: null,
      hasBeenPublished: false,
      authorOptions: [],
      users: [],
      tagOptions: [],
      postModified: false,
      dataLoading: true,
      savingPost: false,
      postLastSaved: null,
      postIsNew: props.match.params.id === 'new',
      coverCropModalOpen: false,
      thumbCropModalOpen: false,
      newDraftModalOpen: false,
      unsavedChangesModalOpen: false,
      schedulePostModalOpen: false,
      unsplashModalOpen: false,
      addImageModalOpen: false,
      unsplashQuery: '',
      // let links pass in default state params
      ...(props.location.state || {}),
    }
    this.quill = React.createRef()
  }
  componentDidMount() {
    const loadData = async () => {
      const users = await this.client.get('/organizations/users')
      this.setState({
        authorOptions: users.map(u => ({ label: u.name, value: u.id })),
        users,
      })
      const blog = await this.client.get('/blogs')
      this.setState({
        tagOptions: Object.keys(blog.tags).map(key => ({
          value: key,
          label: blog.tags[key].name,
        })),
      })
      const { id } = this.props.match.params
      if (id === 'new') {
        await this.setState({ dataLoading: false })
      } else {
        const blogPost = await this.client.get(`/blogs/posts/${id}`)
        this.setState({
          title: blogPost.title || '',
          coverPhotoUri: blogPost.coverPhotoUri || '',
          thumbnailUri: blogPost.thumbnailUri || '',
          publishDate: blogPost.publishDate
            ? moment(blogPost.publishDate)
            : null,
          scheduledPublishDate: blogPost.scheduledPublishDate
            ? moment(blogPost.scheduledPublishDate)
            : null,
          description: blogPost.description || '',
          htmlBody: blogPost.htmlBody || '',
          hasBeenPublished: blogPost.hasBeenPublished,
          tags: blogPost.tags || [],
          author: blogPost.author || '',
          dataLoading: false,
        })
      }
    }
    loadData()
    // Auto save post every minute
    this.autoSavePost = setInterval(this.autoSave, 60 * 1000)
    window.addEventListener('beforeunload', this.onUnload)
  }
  componentWillUnmount() {
    clearInterval(this.autoSavePost)
    window.removeEventListener('beforeunload', this.onUnload)
  }
  // eslint-disable-next-line consistent-return
  onUnload = e => {
    if (this.state.postModified) {
      const confirmMessage =
        'Are you sure you want to leave the page? All unsaved changes will be lost'
      e.returnValue = confirmMessage
      return confirmMessage
    }
  }

  onChange = e =>
    this.setState({ [e.target.name]: e.target.value, postModified: true })

  openCoverCropModal = () => this.setState({ coverCropModalOpen: true })
  openAddImageModal = () => this.setState({ addImageModalOpen: true })
  handleAddImageModalClose = () => this.setState({ addImageModalOpen: false })
  handleCoverCropModalClose = () => this.setState({ coverCropModalOpen: false })
  openThumbCropModal = () => this.setState({ thumbCropModalOpen: true })
  handleThumbCropModalClose = () => this.setState({ thumbCropModalOpen: false })
  openNewDraftModal = () => this.setState({ newDraftModalOpen: true })
  handleNewDraftModalClose = () => this.setState({ newDraftModalOpen: false })
  openUnsavedChangesModal = () =>
    this.setState({ unsavedChangesModalOpen: true })
  handleUnsavedChangesModalClose = () =>
    this.setState({ unsavedChangesModalOpen: false })
  openSchedulePostModal = () => this.setState({ schedulePostModalOpen: true })
  handleSchedulePostModalClose = () =>
    this.setState({ schedulePostModalOpen: false })
  openUnsplashModal = () =>
    this.setState({ unsplashModalOpen: true, unsplashQuery: this.state.title })
  handleUnsplashModalClose = () => this.setState({ unsplashModalOpen: false })

  backtoDash = () => {
    if (this.state.postIsNew) {
      this.openNewDraftModal()
    } else if (this.state.postModified) {
      this.openUnsavedChangesModal()
    } else {
      this.props.history.push('/dashboard/myposts')
    }
  }
  autoSave = () => {
    if (this.state.postModified && !this.state.hasBeenPublished) {
      this.saveDraft()
    }
  }
  saveDraft = async () => {
    this.setState({ savingPost: true, postModified: false })
    const updateBody = {
      title: this.state.title,
      description: this.state.description,
      coverPhotoUri: this.state.coverPhotoUri,
      // if no thumbnail but cover photo make thumb cover photo
      thumbnailUri: this.state.thumbnailUri || this.state.coverPhotoUri,
      htmlBody: this.state.htmlBody,
      publishDate: this.state.publishDate,
      tags: this.state.tags,
      author: this.state.author.value,
    }
    const { id } = this.props.match.params
    try {
      // If we're saving a new post
      if (id === 'new') {
        const { id: newId } = await this.client.post('/blogs/posts', updateBody)
        this.props.history.push(`/posts/${newId}`)
      } else {
        await this.client.put('/blogs/posts', { ...updateBody, id })
      }
      this.setState({
        savingPost: false,
        postIsNew: false,
        postLastSaved: moment(),
      })
    } catch (err) {
      errorMessage('Failed to save blog post')
    }
  }
  publishNow = async () => {
    if (
      !validateState(
        [
          ['title', 'Title'],
          ['htmlBody', 'Body Text'],
          ['publishDate', 'Publish Date'],
          ['author', 'Author'],
        ],
        this.state,
      )
    ) {
      return
    }
    await this.saveDraft()
    await this.client.post(`/blogs/posts/${this.props.match.params.id}/publish`)
    this.setState({ hasBeenPublished: true })
    alertUser('Post Published!')
  }
  schedulePublish = () => {
    if (
      !validateState(
        [
          ['title', 'Title'],
          ['htmlBody', 'Body Text'],
          ['publishDate', 'Publish Date'],
          ['author', 'Author'],
        ],
        this.state,
      )
    ) {
      return
    }
    this.openSchedulePostModal()
  }
  schedulePostPublish = async scheduledPublishDate => {
    await this.saveDraft()
    await this.client.post(
      `/blogs/posts/${this.props.match.params.id}/publish/schedule`,
      {
        scheduledPublishDate,
      },
    )
    this.setState({
      scheduledPublishDate: moment(scheduledPublishDate),
      schedulePostModalOpen: false,
    })
  }
  cancelSchedulePublish = async () => {
    this.setState({ savingPost: true })
    await this.client.delete(
      `/blogs/posts/${this.props.match.params.id}/publish/schedule/cancel`,
    )
    this.setState({ scheduledPublishDate: null, savingPost: false })
  }
  unpublishPost = async () => {
    this.setState({ savingPost: true })
    await this.client.post(
      `/blogs/posts/${this.props.match.params.id}/unpublish`,
    )
    this.setState({ hasBeenPublished: false, savingPost: false })
    alertUser('Post Unpublished')
  }
  unsplashOnConfirmImage = image => {
    this.setState({
      coverPhotoUri: `${image.downloadLink}.jpeg`,
      postModified: true,
    })
  }
  removeCoverPhoto = () => {
    this.setState({ coverPhotoUri: '', postModified: true })
  }
  removeThumbnail = () => {
    this.setState({ thumbnailUri: '', postModified: true })
  }
  imageHandler = () => this.openAddImageModal()
  modules = {
    toolbar: {
      handlers: {
        image: () => this.imageHandler(),
      },
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ align: [] }],
        [
          { list: 'ordered' },
          { list: 'bullet' },
          { indent: '-1' },
          { indent: '+1' },
        ],
        ['link', 'video', 'image'],
        ['clean'],
      ],
    },
    imageResize: {},
  }
  formats = [
    'header',
    'bold',
    'italic',
    'align',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
  ]

  render() {
    if (!this.state) return <div />
    return (
      <>
        <PostNavbar
          hasBeenPublished={this.state.hasBeenPublished}
          backtoDash={this.backtoDash}
          savingPost={this.state.savingPost}
          postLastSaved={this.state.postLastSaved}
          saveDraft={async () => {
            await this.saveDraft()
            this.props.history.push('/dashboard/myposts')
          }}
          publishNow={this.publishNow}
          schedulePublish={this.schedulePublish}
          unpublishPost={this.unpublishPost}
          scheduledPublishDate={this.state.scheduledPublishDate}
          cancelSchedulePublish={this.cancelSchedulePublish}
        />
        <div className="newpost">
          {this.state.dataLoading ? (
            <Spinner className="newpost__spinner" />
          ) : (
            <EditPostView
              postContent={
                !this.state.dataLoading && (
                  <Template1Canonical
                    title={this.state.title}
                    coverPhoto={this.state.coverPhotoUri}
                    description={this.state.description}
                    htmlBody={this.state.htmlBody}
                    tags={this.state.tags.map(t => t.label)}
                    publishDate={this.state.publishDate}
                    author={
                      this.state.users.filter(
                        u => u.id === this.state.author.value,
                      )[0]
                    }
                    isPreview
                    contentComponent={HTMLContent}
                  />
                )
              }
            >
              <div className="newpost__inputs">
                <FormGroup htmlFor="title" label="Title">
                  <InputGroup
                    name="title"
                    value={this.state.title}
                    onChange={this.onChange}
                  />
                </FormGroup>
                <FormGroup htmlFor="author" label="Author">
                  <Select
                    name="author"
                    options={this.state.authorOptions}
                    value={this.state.author}
                    onChange={author =>
                      this.setState({ author, postModified: true })
                    }
                  />
                </FormGroup>
                <FormGroup htmlFor="pubdate-picker" label="Publish Date">
                  <DateInput
                    name="pubdate-picker"
                    value={
                      this.state.publishDate && this.state.publishDate.toDate()
                    }
                    maxDate={new Date()}
                    formatDate={date => moment(date).format('LL')}
                    parseDate={str => moment(str).toDate()}
                    onChange={publishDate =>
                      this.setState({
                        publishDate: moment(publishDate),
                        postModified: true,
                      })
                    }
                  />
                </FormGroup>
                <FormGroup
                  htmlFor="coverPhotoUri"
                  label="Cover Photo"
                  labelInfo="(optional)"
                >
                  {this.state.coverPhotoUri && (
                    <>
                      <button
                        onClick={this.removeCoverPhoto}
                        className="cover__xbutton"
                      >
                        <b>X</b>
                      </button>
                      <img
                        src={this.state.coverPhotoUri}
                        alt="Cover Preview"
                        className="inputscover__preview"
                      />
                      <br />
                    </>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <BlueButton
                      icon="upload"
                      text="Choose file"
                      name="coverPhotoUri"
                      onClick={this.openCoverCropModal}
                      style={{ marginRight: 10 }}
                    />
                    <BlueButton
                      onClick={this.openUnsplashModal}
                      text="Search Bank"
                      icon="imageBank"
                    />
                  </div>
                </FormGroup>
                <FormGroup
                  htmlFor="thumbnailUri"
                  label="Thumbnail"
                  labelInfo="(optional)"
                  helperText="If no thumbnail is provided, will default to cover photo"
                >
                  {this.state.thumbnailUri && (
                    <>
                      <button
                        onClick={this.removeThumbnail}
                        className="cover__xbutton"
                      >
                        <b>X</b>
                      </button>
                      <img
                        src={this.state.thumbnailUri}
                        alt="Thumbnail Preview"
                        className="inputscover__preview"
                      />
                      <br />
                    </>
                  )}
                  <BlueButton
                    text={
                      this.state.thumbnailUri ? 'Change File' : 'Choose file'
                    }
                    name="thumbnailUri"
                    onClick={this.openThumbCropModal}
                    icon="upload"
                  />
                </FormGroup>
                <FormGroup htmlFor="description" label="Description">
                  <TextArea
                    name="description"
                    value={this.state.description}
                    onChange={this.onChange}
                    fill
                    style={{ resize: 'none' }}
                  />
                </FormGroup>
                <FormGroup htmlFor="body-text" label="Body Text">
                  <div>
                    <ReactQuill
                      name="body-text"
                      theme="snow"
                      style={{ height: '500px' }}
                      value={this.state.htmlBody}
                      onChange={(htmlBody, _, source) =>
                        this.setState({
                          htmlBody,
                          postModified: source === 'user',
                        })
                      }
                      placeholder="Start telling your story..."
                      modules={this.modules}
                      format={this.formats}
                      ref={this.quill}
                    />
                  </div>
                </FormGroup>
                <FormGroup
                  htmlFor="tags"
                  label="Tags"
                  style={{ marginTop: 80 }}
                >
                  <Select
                    isMulti
                    name="currentTags"
                    options={this.state.tagOptions}
                    value={this.state.tags}
                    onChange={tags =>
                      this.setState({ tags, postModified: true })
                    }
                    menuPlacement="top"
                  />
                </FormGroup>
              </div>
            </EditPostView>
          )}
        </div>
        {/* Modals */}
        <CropImgUploader
          isOpen={this.state.coverCropModalOpen}
          handleClose={this.handleCoverCropModalClose}
          client={this.client}
          fileLabel="Cover Photo"
          onConfirmCrop={url =>
            this.setState({
              coverPhotoUri: url,
              coverCropModalOpen: false,
              postModified: true,
            })
          }
        />
        <CropImgUploader
          isOpen={this.state.addImageModalOpen}
          handleClose={this.handleAddImageModalClose}
          client={this.client}
          fileLabel="Media upload"
          onConfirmCrop={url => {
            const quill = this.quill.current.getEditor()
            const range = quill.selection.savedRange || {
              index: 0,
            }
            quill.insertEmbed(range.index, 'image', url)
            this.handleAddImageModalClose()
          }}
        />
        <CropImgUploader
          aspectRatio={153 / 133}
          isOpen={this.state.thumbCropModalOpen}
          handleClose={this.handleThumbCropModalClose}
          client={this.client}
          fileLabel="Thumbnail"
          onConfirmCrop={url =>
            this.setState({
              thumbnailUri: url,
              thumbCropModalOpen: false,
              postModified: true,
            })
          }
        />
        <NewDraftModal
          isOpen={this.state.newDraftModalOpen}
          handleClose={this.handleNewDraftModalClose}
          saveAsDraft={async () => {
            await this.saveDraft()
            this.setState({ newDraftModalOpen: false })
            this.props.history.push('/dashboard/myposts')
          }}
          deletePost={async () => {
            const { id } = this.props.match.params
            if (id !== 'new') {
              await this.client.delete(`/blogs/posts/${id}`)
            }
            this.props.history.push('/dashboard/myposts')
          }}
        />
        <UnsavedChangesModal
          isOpen={this.state.unsavedChangesModalOpen}
          handleClose={this.handleUnsavedChangesModalClose}
          discardChanges={() => {
            this.setState({ unsavedChangesModalOpen: false })
            this.props.history.push('/dashboard/myposts')
          }}
        />
        <SchedulePostModal
          isOpen={this.state.schedulePostModalOpen}
          handleClose={this.handleSchedulePostModalClose}
          schedulePostPublish={this.schedulePostPublish}
        />
        <UnsplashModal
          isOpen={this.state.unsplashModalOpen}
          handleClose={this.handleUnsplashModalClose}
          query={this.state.unsplashQuery}
          onConfirmImage={this.unsplashOnConfirmImage}
        />
      </>
    )
  }
}

export default NewPost
