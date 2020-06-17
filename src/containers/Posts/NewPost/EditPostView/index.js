import React, { Component } from 'react'
import './styles.sass'
import IndexPreview from './IndexPreview'

class EditPostView extends Component {
  state = { showPreview: true }
  hidePreview = () => this.setState({ showPreview: !this.state.showPreview })
  render() {
    const { showPreview } = this.state
    return (
      <div
        className={`editheader ${
          showPreview ? 'editheader__preview' : 'editheader__full'
        }`}
      >
        <div
          className={`editheader__inputs ${
            showPreview ? 'inputs__side' : 'inputs__wide'
          }`}
          id="editheader__inputs"
        >
          {this.props.topPart}
          <br />
          {this.props.children}
        </div>
        <IndexPreview hidePreview={this.hidePreview} showPreview={showPreview}>
          {this.props.postContent}
        </IndexPreview>
      </div>
    )
  }
}

export default EditPostView
