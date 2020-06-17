import React, { Component } from 'react'
import {
  Dialog,
  FormGroup,
  InputGroup,
  TextArea,
  Button,
} from '@blueprintjs/core'
import uuid from 'uuid/v4'
import './styles.sass'

class TagModal extends Component {
  state = {
    name: '',
    description: '',
  }
  onChange = e => this.setState({ [e.target.name]: e.target.value })
  onClick = () =>
    this.props.modifyTag(this.props.modalTagKey || uuid(), this.state)
  render() {
    const { isOpen, handleClose, isEdit } = this.props
    return (
      <Dialog
        icon={isEdit ? 'edit' : 'add'}
        isOpen={isOpen}
        onClose={handleClose}
        onOpening={() =>
          this.setState({
            name: this.props.modalTagName,
            description: this.props.modalTagDescription,
          })
        }
        title={isEdit ? 'Edit Tag' : 'Create New Tag'}
      >
        <div id="tagmodal-inputs">
          <FormGroup htmlFor="name" label="Name">
            <InputGroup
              name="name"
              value={this.state.name}
              onChange={this.onChange}
            />
          </FormGroup>
          <FormGroup
            htmlFor="description"
            label="Description"
            helperText="Description that will show up on tag page"
          >
            <TextArea
              name="description"
              value={this.state.description}
              onChange={this.onChange}
              fill
              style={{ resize: 'none' }}
            />
          </FormGroup>
          <Button onClick={this.onClick}>{isEdit ? 'Edit' : 'Create'}</Button>
        </div>
      </Dialog>
    )
  }
}

export default TagModal
