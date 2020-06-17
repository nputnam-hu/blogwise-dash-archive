import React, { Component } from 'react'
import Client from '../../../../../client'
import './styles.sass'
import { Spinner } from '@blueprintjs/core'
import Visibility from '../../../../../components/BlueButton/icons/visibility'
import VisibilityHidden from '../../../../../components/BlueButton/icons/visibilityHidden'

class IndexPreview extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      tags: {},
      blogData: {},
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.setState({
        dataLoading: false,
      })
    })
  }
  render() {
    const { hidePreview, showPreview } = this.props
    return (
      <div
        className={`preview__container ${
          showPreview ? 'preview__container__full' : 'preview__container__small'
        } `}
        id="preview__container"
      >
        <span className="preview__text">
          Live Preview{' '}
          <button className="hide__preview" onClick={hidePreview}>
            {showPreview ? <Visibility /> : <VisibilityHidden />}
          </button>
        </span>
        {showPreview && (
          <div className="preview__body">
            {this.state.dataLoading ? (
              <Spinner />
            ) : (
              <div>{this.props.children}</div>
            )}
          </div>
        )}
      </div>
    )
  }
}

export default IndexPreview
