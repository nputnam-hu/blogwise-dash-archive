import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Elevation } from '@blueprintjs/core'
import QuestionHint from '../../../../../../components/QuestionHint'
import sidebar from './sidebar.png'
import navbar from './navbar.png'
import header from './header.png'
import appearenceIcon from './appearenceIcon.svg'
import './styles.sass'

const Appearence = () => (
  <div id="appearence-container">
    <div className="section-header myblog">
      <img src={appearenceIcon} alt="Users" />
      <div style={{ width: '10px' }} />
      <a href="#appearence" name="appearence">
        <h2>Appearance</h2>
      </a>
      <QuestionHint
        title="Customize Appearance"
        helperText="You can customize the appearence of your blog by uploading images, choosing colors, including links to your social media accounts, and more."
      />
    </div>
    <h3 className="appearence__subheader">CUSTOM ELEMENTS</h3>
    <div id="appearence-cards">
      <Link to="/edit/header">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={header} alt="Header" />
          <span>Homepage Header</span>
        </Card>
      </Link>
      <Link to="/edit/sidebar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={sidebar} alt="Sidebar" />
          <span>Homepage Sidebar</span>
        </Card>
      </Link>
      <Link to="/edit/navbar">
        <Card
          className="uicomponent-card"
          interactive
          elevation={Elevation.TWO}
        >
          <img src={navbar} alt="Navbar" />
          <span>Navigation Bar</span>
        </Card>
      </Link>
    </div>
  </div>
)

export default Appearence
