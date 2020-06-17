import React from 'react'
import { Button } from '@blueprintjs/core'
import { Link } from 'react-router-dom'
import store from 'store'
import logo from './logo.png'
import yellowLogo from './logo-yellow.png'
import './styles.sass'

const Navbar = () => (
  <div id="navbar-container">
    <Link to="/dashboard" className="navbar-container">
      <img src={logo} alt="Blogwise Logo" className="navbar-logo" />
    </Link>
    <Button
      className="logout-button"
      onClick={() => {
        store.remove('user')
        store.remove('blog')
        window.location = '/login'
      }}
    >
      Log Out
    </Button>
  </div>
)

export const ReducedNavbar = () => (
  <div
    className="navbar-container--reduced"
    style={{ background: 'white', borderBottom: 'none' }}
  >
    <a href="/">
      <img src={yellowLogo} alt="Blogwise Logo" className="navbar-logo" />
    </a>
  </div>
)

export default Navbar
