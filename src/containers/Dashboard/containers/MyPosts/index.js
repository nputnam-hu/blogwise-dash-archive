import React, { Component } from 'react'
import {
  Button,
  Spinner,
  Card,
  Elevation,
  Intent,
  Popover,
  Position,
  Menu,
  MenuItem,
} from '@blueprintjs/core'
import moment from 'moment'
import Client from '../../../../client'
import './styles.sass'
import DeletePostModal from './DeletePostModal'
import BlueButton from '../../../../components/BlueButton'

class MyPosts extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      blogPosts: [],
      dataLoading: true,
      deletePostModalOpen: false,
      deletePostId: '',
      dropDownsOpen: {},
    }
  }
  componentDidMount() {
    this.client.get('/blogs/posts').then(blogPosts => {
      this.setState({ blogPosts, dataLoading: false })
    })
  }
  openDeletePostModal = (e, deletePostId) => {
    if (!e) {
      // eslint-disable-next-line no-param-reassign
      e = window.event
    }
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()

    this.setState({ deletePostModalOpen: true, deletePostId })
  }
  handleDeletePostModalClose = () =>
    this.setState({ deletePostModalOpen: false })
  deletePost = async () => {
    await this.client.delete(`/blogs/posts/${this.state.deletePostId}`)
    const newBlogPosts = this.state.blogPosts.filter(
      p => p.id !== this.state.deletePostId,
    )
    this.setState({
      blogPosts: newBlogPosts,
      deletePostModalOpen: false,
      deletePostId: '',
    })
  }
  closeDropDown = id => {
    const newDropDownOpens = { ...this.state.dropDownsOpens }
    newDropDownOpens[id] = false
    this.setState({ dropDownsOpen: newDropDownOpens })
  }
  renderBlogPostList = blogPosts =>
    blogPosts.map(post => (
      <>
        <Card
          key={post.id}
          elevation={Elevation.ONE}
          interactive
          onClick={() => this.props.history.push(`/posts/${post.id}`)}
          className="list__card"
        >
          <div className="card">
            <h2>{post.title || 'Untitled Post'}</h2>
            <div className="card__bottom">
              {post.User && (
                <>
                  <img
                    className="headshot"
                    alt={post.User.name}
                    src={post.User.headshotUri}
                  />
                  <span className="authorname">{post.User.name}</span>
                </>
              )}
              {post.publishDate && (
                <span className="card__infotext">
                  {moment(post.publishDate).format('LL')}
                </span>
              )}
            </div>
          </div>
          <div style={{ width: '10px' }} />
          <Popover
            isOpen={this.state.dropDownsOpen[post.id] || false}
            position={Position.BOTTOM}
            className="card__settingsbutton"
            onInteraction={(_, e) => {
              if (!e) {
                // eslint-disable-next-line no-param-reassign
                e = window.event
              }
              e.cancelBubble = true
              if (e.stopPropagation) {
                e.stopPropagation()
              }

              this.setState({
                dropDownsOpen: {
                  ...this.state.dropDownsOpen,
                  [post.id]: true,
                },
              })
            }}
            onClose={() => this.closeDropDown(post.id)}
          >
            <Button
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="button__settingsicon"
                >
                  <g id="icon/action/settings_24px">
                    <path
                      id="icon/action/settings_24px_2"
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.6271 9C14.6271 9.255 14.6046 9.495 14.5746 9.735L16.1571 10.9725C16.2996 11.085 16.3371 11.2875 16.2471 11.4525L14.7471 14.0475C14.6796 14.1675 14.5521 14.235 14.4246 14.235C14.3796 14.235 14.3346 14.2275 14.2896 14.2125L12.4221 13.4625C12.0321 13.755 11.6121 14.01 11.1546 14.1975L10.8696 16.185C10.8471 16.365 10.6896 16.5 10.5021 16.5H7.50208C7.31458 16.5 7.15708 16.365 7.13458 16.185L6.84958 14.1975C6.39208 14.01 5.97208 13.7625 5.58208 13.4625L3.71458 14.2125C3.67708 14.2275 3.63208 14.235 3.58708 14.235C3.45208 14.235 3.32458 14.1675 3.25708 14.0475L1.75708 11.4525C1.66708 11.2875 1.70458 11.085 1.84708 10.9725L3.42958 9.735C3.39958 9.495 3.37708 9.2475 3.37708 9C3.37708 8.7525 3.39958 8.505 3.42958 8.265L1.84708 7.0275C1.70458 6.915 1.65958 6.7125 1.75708 6.5475L3.25708 3.9525C3.32458 3.8325 3.45208 3.765 3.57958 3.765C3.62458 3.765 3.66958 3.7725 3.71458 3.7875L5.58208 4.5375C5.97208 4.245 6.39208 3.99 6.84958 3.8025L7.13458 1.815C7.15708 1.635 7.31458 1.5 7.50208 1.5H10.5021C10.6896 1.5 10.8471 1.635 10.8696 1.815L11.1546 3.8025C11.6121 3.99 12.0321 4.2375 12.4221 4.5375L14.2896 3.7875C14.3271 3.7725 14.3721 3.765 14.4171 3.765C14.5521 3.765 14.6796 3.8325 14.7471 3.9525L16.2471 6.5475C16.3371 6.7125 16.2996 6.915 16.1571 7.0275L14.5746 8.265C14.6046 8.505 14.6271 8.745 14.6271 9ZM13.1271 9C13.1271 8.8425 13.1196 8.685 13.0896 8.4525L12.9846 7.605L13.6521 7.08L14.4546 6.4425L13.9296 5.535L12.9771 5.9175L12.1821 6.24L11.4996 5.715C11.1996 5.49 10.8996 5.3175 10.5771 5.1825L9.78207 4.86L9.66207 4.0125L9.51957 3H8.47707L8.32707 4.0125L8.20707 4.86L7.41207 5.1825C7.10457 5.31 6.79707 5.49 6.47457 5.73L5.79957 6.24L5.01957 5.925L4.06707 5.5425L3.54207 6.45L4.35207 7.08L5.01957 7.605L4.91457 8.4525C4.89207 8.6775 4.87707 8.85 4.87707 9C4.87707 9.15 4.89207 9.3225 4.91457 9.555L5.01957 10.4025L4.35207 10.9275L3.54207 11.5575L4.06707 12.465L5.01957 12.0825L5.81457 11.76L6.49707 12.285C6.79707 12.51 7.09707 12.6825 7.41957 12.8175L8.21457 13.14L8.33457 13.9875L8.47707 15H9.52707L9.67707 13.9875L9.79707 13.14L10.5921 12.8175C10.8996 12.69 11.2071 12.51 11.5296 12.27L12.2046 11.76L12.9846 12.075L13.9371 12.4575L14.4621 11.55L13.6521 10.92L12.9846 10.395L13.0896 9.5475C13.1121 9.3225 13.1271 9.1575 13.1271 9ZM9.00207 6C7.34457 6 6.00207 7.3425 6.00207 9C6.00207 10.6575 7.34457 12 9.00207 12C10.6596 12 12.0021 10.6575 12.0021 9C12.0021 7.3425 10.6596 6 9.00207 6ZM7.50207 9C7.50207 9.825 8.17707 10.5 9.00207 10.5C9.82707 10.5 10.5021 9.825 10.5021 9C10.5021 8.175 9.82707 7.5 9.00207 7.5C8.17707 7.5 7.50207 8.175 7.50207 9Z"
                      fill="#848484"
                    />
                  </g>
                </svg>
              }
              className="card__settingsbutton"
              rightIcon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="icon/navigation/expand_more_24px">
                    <path
                      id="icon/navigation/expand_more_24px_2"
                      d="M12.4425 6.22119L9 9.65619L5.5575 6.22119L4.5 7.27869L9 11.7787L13.5 7.27869L12.4425 6.22119Z"
                      fill="#848484"
                    />
                  </g>
                </svg>
              }
            />
            <Menu>
              <MenuItem
                text="Delete Post"
                intent={Intent.DANGER}
                onClick={e => {
                  this.closeDropDown(post.id)
                  this.openDeletePostModal(e, post.id)
                }}
              />
            </Menu>
          </Popover>
        </Card>
      </>
    ))

  render() {
    const [livePosts, draftPosts] = this.state.blogPosts
      .sort(
        (a, b) =>
          moment(b.publishDate || b.updateAt).toDate() -
          moment(a.publishDate || a.updateAt).toDate(),
      )
      .reduce(
        (acc, el) => {
          const insertIndex = Number(!el.hasBeenPublished)
          acc[insertIndex].push(el)
          return acc
        },
        [[], []],
      )
    return (
      <>
        <div className="myposts">
          <div className="myposts__header">
            <div className="section-header myblog">
              <h2>My Blog Posts</h2>
            </div>
            <BlueButton
              large
              icon="plus"
              className="header__button"
              onClick={() => this.props.history.push('/posts/new')}
            >
              New Post
            </BlueButton>
          </div>
          <div className="myposts__list">
            {this.state.dataLoading && <Spinner />}
            {this.state.blogPosts.length === 0 && !this.state.dataLoading ? (
              <div style={{ paddingTop: '70px', textAlign: 'center' }}>
                <h1>Looks Like you don't have any blog posts yet</h1>
                <p>Click the button above to get started</p>
              </div>
            ) : (
              !this.state.dataLoading && (
                <>
                  {livePosts.length > 0 && (
                    <>
                      <h4 className="myposts__sectionheader">Live Posts</h4>
                      {this.renderBlogPostList(livePosts)}
                    </>
                  )}
                  {draftPosts.length > 0 && (
                    <>
                      <h4 className="myposts__sectionheader">Drafts</h4>
                      {this.renderBlogPostList(draftPosts)}
                    </>
                  )}
                </>
              )
            )}
          </div>
        </div>
        {/* Modals */}
        <DeletePostModal
          isOpen={this.state.deletePostModalOpen}
          handleClose={this.handleDeletePostModalClose}
          cancelDelete={this.handleDeletePostModalClose}
          deletePost={this.deletePost}
        />
      </>
    )
  }
}

export default MyPosts
