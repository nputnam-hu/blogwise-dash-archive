import React, { Component } from 'react'
import { Button, H5 } from '@blueprintjs/core'
import TagModal from './components/TagModal'
import QuestionHint from '../../../../../../components/QuestionHint'
import Client from '../../../../../../client'
import { validateState } from '../../../../../../toaster'
import tagIcon from './tagIcon.svg'
import './styles.sass'
import BlueButton from '../../../../../../components/BlueButton'

const splitArrayInThree = arr => {
  const retArrays = [[], [], []]
  for (let i = 0; i < arr.length; i += 1) {
    retArrays[i % 3].push(arr[i])
  }
  return retArrays
}

const TagColumn = ({ tagKeys, tags, onClickKey }) => (
  <div className="tags__col">
    {tagKeys.map(key => {
      const { name, description } = tags[key]
      return (
        <div key={key} className="tag">
          <div className="tag__text">
            <H5>{name}</H5>
            <p>{description}</p>
          </div>
          <div className="tag__buttons">
            <Button icon="edit" onClick={onClickKey(key)} minimal />
          </div>
        </div>
      )
    })}
  </div>
)

class Tags extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      tags: {},
      modalOpen: false,
      modalIsEdit: false,
      modalTagName: '',
      modalTagDescription: '',
      modalTagKey: '',
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({ tags: blog.tags || {} })
    })
  }
  openModalEdit = tagKey => () =>
    this.setState({
      modalOpen: true,
      modalIsEdit: true,
      modalTagName: this.state.tags[tagKey].name,
      modalTagDescription: this.state.tags[tagKey].description,
      modalTagKey: tagKey,
    })
  openModalNew = () =>
    this.setState({
      modalOpen: true,
      modalIsEdit: false,
      modalTagName: '',
      modalTagDescription: '',
      modalTagKey: '',
    })
  modifyTag = async (tagKey, newTag) => {
    if (!validateState(['name'], newTag)) {
      return
    }
    const newTags = { ...this.state.tags, [tagKey]: newTag }
    await this.client.put('/blogs', { tags: newTags })
    this.setState({
      modalOpen: false,
      tags: newTags,
    })
  }
  handleClose = () => this.setState({ modalOpen: false })
  render() {
    const [tags1, tags2, tags3] = splitArrayInThree(
      Object.keys(this.state.tags).sort(),
    )
    return (
      <>
        <div id="tags-container">
          <div className="section-header myblog">
            <img src={tagIcon} alt="Tags" />
            <div style={{ width: '10px' }} />
            <h2>Tags</h2>
            <QuestionHint
              title="Tags"
              helperText="Tags are used to categorize your posts into different topics. The tags for each post will be displayed at the bottom of the page, and users can search articles by tag."
            />
            <BlueButton
              onClick={this.openModalNew}
              icon="plus"
              disabled={this.state.locked}
              className="myblog__button"
              large
            >
              New Tag
            </BlueButton>
          </div>
          {tags1.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: '40px',
              }}
            >
              <h2>Looks like you don't have any tags yet</h2>
              <span>
                Tags are used to categorize your blog posts for your viewers.
                Click the button above to get started
              </span>
            </div>
          ) : (
            <div className="tags">
              <TagColumn
                tagKeys={tags1}
                tags={this.state.tags}
                onClickKey={this.openModalEdit}
              />
              <TagColumn
                tagKeys={tags2}
                tags={this.state.tags}
                onClickKey={this.openModalEdit}
              />
              <TagColumn
                tagKeys={tags3}
                tags={this.state.tags}
                onClickKey={this.openModalEdit}
              />
            </div>
          )}
        </div>
        {/* Modals */}
        <TagModal
          isOpen={this.state.modalOpen}
          handleClose={this.handleClose}
          isEdit={this.state.modalIsEdit}
          modifyTag={this.modifyTag}
          modalTagName={this.state.modalTagName}
          modalTagDescription={this.state.modalTagDescription}
          modalTagKey={this.state.modalTagKey}
        />
      </>
    )
  }
}

export default Tags
