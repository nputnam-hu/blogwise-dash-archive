import React, { Component } from 'react'
import IndexContent from './IndexContent'
import Client from '../../client'
import './styles.sass'
import { Spinner } from '@blueprintjs/core'

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
        tags: blog.tags,
        blogData: {
          title: blog.title || '',
          name: blog.companyName || '',
          description: blog.description || '',
          headerPhotoUri: blog.headerPhotoUri || '',
          sidebarPhotoUri: blog.sidebarPhotoUri || '',
          faviconPhotoUri: blog.faviconPhotoUri || '',
          bgImgUri: blog.bgImgUri || '',
          backgroundHexCode: blog.backgroundHexCode || '',
          mainSiteUrl: blog.mainSiteUrl || '',
          twitterUrl: blog.twitterUrl
            ? `https://twitter.com/${blog.twitterUrl}`
            : '',
          facebookUrl: blog.facebookUrl
            ? `https://www.facebook.com/${blog.facebookUrl}`
            : '',
          linkedinUrl: blog.linkedinUrl
            ? `https://www.linkedin.com/${blog.linkedinUrl}`
            : '',
          headerTextColor: blog.headerTextColor || '',
          navbarHexCode: blog.navbarHexCode || '',
        },
      })
      setTimeout(() => {
        if (this.props.idToScrollTo) {
          const el = document.getElementById(this.props.idToScrollTo)
          if (el) {
            const topPos = el.offsetTop - 80
            document
              .getElementById('preview')
              .scrollTo({ top: topPos, behavior: 'smooth' })
          }
        }
      }, 500)
    })
  }
  render() {
    return (
      <div className="preview" id="preview">
        <span className="preview__text">Live Preview</span>
        <div style={{ height: '20px' }} />
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <IndexContent
            posts={[]}
            tags={Object.values(this.props.tags || this.state.tags).map(
              t => t.name,
            )}
            blogData={{ ...this.state.blogData, ...this.props.blogData }}
          />
        )}
      </div>
    )
  }
}

export default IndexPreview
