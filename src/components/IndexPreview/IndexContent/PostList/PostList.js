/* eslint-disable react/no-array-index-key */
import React from 'react'

import PostCard from './PostCard'

import styles from './PostList.module.sass'

class PostList extends React.Component {
  render() {
    const { n } = this.props

    const posts = Array.from({ length: n })

    let PostCards = <div />
    if (posts && posts.length <= 3) {
      PostCards = posts.map(() => <PostCard />)
    } else if (posts && posts.length > 3) {
      const firstHalf = posts.slice(0, 3)
      const secondHalf = posts.slice(3)
      PostCards = (
        <>
          {firstHalf.map((_, i) => (
            <PostCard key={i} />
          ))}
          {this.props.children}
          {secondHalf.map((_, i) => (
            <PostCard key={i} s />
          ))}
        </>
      )
    }
    return <div className={styles.PostList}>{PostCards}</div>
  }
}

export default PostList
