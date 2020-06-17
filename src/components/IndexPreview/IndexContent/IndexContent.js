import React from 'react'
import Searchbar from './Searchbar'
import PostList from './PostList'
import TagList from './TagList'
import linkedin from './linkedin.png'
import facebook from './facebook.png'
import twitter from './twitter.png'
import searchIcon from './search.svg'

import styles from './IndexContent.module.sass'

const IndexContent = ({ blogData, tags }) => {
  const {
    title,
    name,
    description,
    backgroundHexCode,
    headerTextColor,
    headerPhotoUri,
    sidebarPhotoUri,
    bgImgUri,
    twitterUrl,
    facebookUrl,
    linkedinUrl,
  } = blogData

  // Build header contents
  const HeaderContent = (
    <div
      id="headercontainer"
      className={styles.Index__header}
      style={{ background: bgImgUri ? '' : backgroundHexCode }}
    >
      <img
        id="headerimg"
        className={styles.Index__header__img}
        alt={`${name} logo`}
        src={headerPhotoUri}
      />
      <div
        id="headertext"
        className={styles.Index__header__text}
        style={{ color: headerTextColor }}
      >
        {title}
      </div>
    </div>
  )

  // Construct tags list
  const TagsList = (
    <div className={styles.Index__tagsContainer}>
      {tags && tags.length > 0 && <TagList title="Topics" tags={tags} />}
    </div>
  )

  // Construct featured articles
  const FeaturedArticles = (
    <PostList n={5}>
      <div className={styles.Index__midContent}>
        <hr className={styles.Index__midContent__linebreak} />
        {/* About Section  */}
        <div className={styles.Index__about}>
          <div className={styles.Index__about__title}>About {name}</div>
          <div className={styles.Index__about__description}>{description}</div>
          <span className={styles.Index__about__link} to="/about">
            Read more &gt;
          </span>
        </div>
        {/* Tags Section */}
        {TagsList}
        <hr className={styles.Index__midContent__linebreak} />
      </div>
    </PostList>
  )

  // Construct social media icons
  const SocialMediaIcons = (
    <div className={styles.Index__socialContainer}>
      {(twitterUrl || facebookUrl || linkedinUrl) && (
        <div className={styles.Index__social}>
          <div className={styles.Index__social__title}>Find us on</div>
          <div className={styles.Index__social__links}>
            {twitterUrl && (
              <a
                className={styles.Index__social__link}
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="twitter"
              >
                <img src={twitter} alt="twitter" />
              </a>
            )}
            {facebookUrl && (
              <a
                className={styles.Index__social__link}
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="facebook"
              >
                <img src={facebook} alt="facebook" />
              </a>
            )}
            {linkedinUrl && (
              <a
                className={styles.Index__social__link}
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="linkedin"
              >
                <img src={linkedin} alt="linkedin" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className={styles.Index}>
      {/* Header Image */}
      {bgImgUri ? (
        <div>
          <div
            id="headercontainer"
            className={styles.Index__headerContainer}
            style={{ background: `url(${bgImgUri})` }}
          >
            {HeaderContent}
          </div>
        </div>
      ) : (
        <div
          id="headercontainer"
          style={{ background: backgroundHexCode }}
          className={styles.Index__headerContainer}
        >
          {HeaderContent}
        </div>
      )}
      <div className={styles.Index__contentContainer}>
        {/* Featured Articles */}
        <div className={styles.Index__content}>
          <div className={styles.Index__mobileMenu}>
            {(twitterUrl || facebookUrl || linkedinUrl) && (
              <div className={styles.Index__mobileMenu__social}>
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={twitter} alt="twitter" />
                  </a>
                )}
                {facebookUrl && (
                  <a
                    href={facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={facebook} alt="facebook" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={linkedin} alt="linkedin" />
                  </a>
                )}
                <span style={{ color: '#B3B3B3', marginRight: '15px' }}>|</span>
              </div>
            )}
            <span to="/about" className={styles.Index__mobileMenu__about}>
              About
            </span>
            <span to="/search" className={styles.Index__mobileMenu__search}>
              <img src={searchIcon} alt="Search Posts" />
            </span>
          </div>
          <div className={styles.Index__content__header}>
            <div className={styles.Index__content__header__title}>
              Featured Articles
            </div>
            <span className={styles.Index__content__header__link} to="/latest">
              See all
            </span>
          </div>
          {FeaturedArticles}
        </div>
        {/* Right Side Content */}
        <div className={styles.Index__rightContent}>
          <div className={styles.Index__rightContent__search}>
            <Searchbar />
          </div>
          {/* About Section  */}
          <div className={styles.Index__about}>
            <div className={styles.Index__about__title} id="companyName">
              About {name}
            </div>
            <div className={styles.Index__about__sidebar} id="sidebar">
              <img
                alt={`${name} logo`}
                src={sidebarPhotoUri}
                id="rightlogo"
                style={{ maxHeight: '30px' }}
              />
            </div>
            <div className={styles.Index__about__description} id="description">
              {description}
            </div>

            <span className={styles.Index__about__link} to="/about">
              Read more &gt;
            </span>
          </div>
          {/* Tags Section */}
          {TagsList}
          {/* Social Icons Section */}
          {SocialMediaIcons}
        </div>
      </div>
    </div>
  )
}
export default IndexContent
