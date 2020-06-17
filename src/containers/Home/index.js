import React from 'react'
import './styles.sass'

const Home = () => (
  <div id="home-container">
    <h1>Welcome to the Blogwise App</h1>
    <ul>
      <li>
        <a href="/login">Login to Your Account</a>
      </li>

      <li>
        <a href="/register">Create an Account</a>
      </li>
    </ul>
  </div>
)

export default Home
