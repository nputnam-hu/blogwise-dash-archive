import React from 'react'
import ContentLoader from 'react-content-loader'

const MyLoader = () => (
  <ContentLoader
    style={{ height: 100, marginBottom: '48px', width: '100%' }}
    animate={false}
    ariaLabel={false}
  >
    {/* Only SVG shapes */}
    <rect x="0" y="0" rx="5" ry="5" width="100" height="153" />
    <rect x="130" y="17" rx="4" ry="4" width="1600" height="23" />
    <rect x="130" y="60" rx="3" ry="3" width="550" height="17" />
  </ContentLoader>
)

class PostCard extends React.Component {
  render() {
    return <MyLoader />
  }
}

export default PostCard
