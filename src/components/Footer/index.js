import React from 'react'
import logo from './logo.png'
import './styles.sass'

const Footer = () => (
  <>
    <div style={{ height: '50px' }} />
    <div id="footer-container">
      <img alt="blogwise" id="footer-logo" src={logo} />
      <div id="footer-links">
        <span>©blogwise 2019</span>
        <a href="mailto:support@blogwise.co">contact us</a>
        <a
          href="https://www.blogwise.co/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
        >
          privacy policy
        </a>
      </div>
    </div>
  </>
)

export default Footer
