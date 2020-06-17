import React from 'react'

import styles from './TagList.module.sass'

class TagList extends React.Component {
  render() {
    const { tags, title } = this.props
    return (
      <div className={styles.Index__tags}>
        {title && <div className={styles.Index__tags__title}>{title}</div>}
        <ul className={styles.Index__tags__list}>
          {tags.map(tag => (
            <span key={tag}>
              <li>{tag}</li>
            </span>
          ))}
        </ul>
      </div>
    )
  }
}

export default TagList
