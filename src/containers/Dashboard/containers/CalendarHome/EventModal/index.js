import React, { Component } from 'react'
import moment from 'moment'
import { Dialog, FormGroup, InputGroup, Button } from '@blueprintjs/core'
import { DateInput } from '@blueprintjs/datetime'
import Select from 'react-select'
import './styles.sass'

class EditModal extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      title: '',
      dueDate: '',
      tags: [],
      authorId: '',
      id: '',
      users: [],
      tagNames: [],
    }
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onSelectChange = e => this.setState({ type: e.currentTarget.value })
  onClick = () => {
    this.props.submitEvent(this.state)
  }
  writePost = () => {
    this.props.history.push('/posts/new', {
      title: this.state.title,
      tags: this.state.tags,
      author: this.state.authorId,
      publishDate: this.state.dueDate,
    })
  }
  openCropModal = () => this.setState({ cropModalOpen: true })
  handleCropModalClose = () => this.setState({ cropModalOpen: false })
  render() {
    const { isOpen, handleClose } = this.props
    console.log(this.state.authorId)
    return (
      <Dialog
        isOpen={isOpen}
        onClose={handleClose}
        className="eventmodal__popup"
        backdropClassName="eventmodal__backdrop"
        onOpening={() => {
          this.client.get('/organizations/users').then(users => {
            console.log(
              users.filter(u => u.id === this.props.defaultState.authorId)[0],
            )
            this.client.get('/blogs').then(blog => {
              const tagNames = Object.keys(blog.tags).map(key => ({
                value: key,
                label: blog.tags[key].name,
              }))
              this.setState({
                tagNames,
                users: users.map(u => ({ value: u.id, label: u.name })),
                ...this.props.defaultState,
                authorId: this.props.defaultState.authorId
                  ? users
                      .filter(u => u.id === this.props.defaultState.authorId)
                      .map(u => ({ value: u.id, label: u.name }))[0]
                  : '',
              })
            })
          })
        }}
      >
        <div className="eventmodal">
          <FormGroup htmlFor="title" label="Post Headline">
            <InputGroup
              name="title"
              placeholder="Your headline here"
              value={this.state.title}
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup htmlFor="tags" label="Tags">
            <Select
              isMulti
              name="currentTags"
              options={this.state.tagNames}
              value={this.state.tags}
              onChange={tags =>
                this.setState({
                  tags,
                })
              }
              className="tagmultiselect"
            />
          </FormGroup>
          <FormGroup htmlFor="users" label="Assigned To">
            <Select
              name="users"
              options={this.state.users}
              value={this.state.authorId}
              onChange={authorId => this.setState({ authorId })}
              className="emailmultiselect"
            />
          </FormGroup>
          <FormGroup htmlFor="duedate-picker" label="Due Date">
            <DateInput
              name="duedate-picker"
              value={
                this.state.dueDate && this.state.dueDate.toDate
                  ? this.state.dueDate.toDate()
                  : this.state.dueDate
              }
              formatDate={date => moment(date).format('LL')}
              parseDate={str => moment(str).toDate()}
              onChange={selectedDate => {
                this.setState({
                  dueDate: selectedDate,
                })
              }}
            />
          </FormGroup>
          <div className="eventmodal__buttons">
            <button onClick={this.onClick} className="eventmodal__blueButton">
              Save
            </button>
            {this.state.id && (
              <Button
                minimal
                onClick={this.writePost}
                className="eventmodal__writeButton"
              >
                Write this Post
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    )
  }
}

export default EditModal
