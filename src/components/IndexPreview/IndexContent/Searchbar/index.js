import React, { Component } from 'react'
import SearchIcon from './search.svg'
import styles from './Searchbar.module.sass'
import './styles.sass'

export const SearchWidget = ({
  query = '',
  handleChange,
  submitSearch,
  autoFocus = false,
  size = '',
}) => (
  <div className={styles.SearchWidget}>
    <input
      id="searchbar"
      disabled
      type="text"
      className={size}
      value={query || ''}
      onChange={handleChange}
      onKeyPress={e => {
        if (e.key === 'Enter') {
          submitSearch()
        }
      }}
      placeholder="Search Posts"
      // eslint-disable-next-line
      autoFocus={autoFocus}
    />
    <button className={size} id="searchbutton" onClick={submitSearch}>
      <img
        className={size}
        id="searchicon"
        alt="search posts"
        src={SearchIcon}
      />
    </button>
  </div>
)

class Searchbar extends Component {
  handleChange = event => {
    this.setState({ query: event.target.value })
  }
  render() {
    return (
      <SearchWidget
        query=""
        submitSearch={this.submitSearch}
        handleChange={this.handleChange}
      />
    )
  }
}

export default Searchbar
