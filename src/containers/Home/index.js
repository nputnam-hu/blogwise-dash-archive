import React from 'react'
import team from './team.png'
import './styles.sass'

const Home = () => (
  <div id="home-container">
    <div className="text">
      <h1>Welcome to the Blogwise Archive!</h1>
      <p className="opening">
        Blogwise was a SaaS product built by four friends:{' '}
        <a
          href="https://www.linkedin.com/in/ivraj/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ivraj Seerha
        </a>
        ,{' '}
        <a
          href="https://www.linkedin.com/in/dara-wenjia-li/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Dara Li
        </a>
        ,{' '}
        <a
          href="https://www.linkedin.com/in/annelise-hillmann/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Annelise Hillman
        </a>
        , and{' '}
        <a
          href="https://www.twitter.com/noah_putnam"
          target="_blank"
          rel="noopener noreferrer"
        >
          Noah Putnam
        </a>
        . We set out together in Spring 2019 to build a product that made it so
        that anyone could easily create a fast, beautiful blog.
      </p>
      <img src={team} alt="The Team" />
      <span>
        <em>Our Team Photo circa 2019</em>
      </span>
      <p className="opening">
        {' '}
        While we ultimately shut blogwise down, we built this archive to
        preserve the work we did in scaling blogwise from just an idea to a
        functioning product with dozens of users.
      </p>
      <h2>Archive Websites</h2>
      <p>There are two archived websites from the blogwise product:</p>
      <ul>
        <li>
          <a
            href="https://blogwise-landing-archive.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Blogwise Landing Page Archive
          </a>{' '}
          - this was our landing page which was our primary marketing channel
        </li>
        <li>
          <a
            href="https://blogwise-dashboard-archive.netlify.app/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Blogwise Dashboard Achive
          </a>
          - this was the admin dashboard for users to create and manage their
          blogs. The archive site has been configured to be read only, reading
          from our dog-fooded blogwise account. You can also access the original
          onboarding flow{' '}
          <a
            href="https://blogwise-dashboard-archive.netlify.app/register"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>
          .
        </li>
      </ul>
      <h2>Codebases</h2>
      <ul>
        <li>
          <a
            href="https://github.com/nputnam-hu/blogwise-dash"
            target="_blank"
            rel="noopener noreferrer"
          >
            blogwise-dash
          </a>
          : the original codebase for the admin dashboard. Written with React,
          sass, and BlueprintJS.
        </li>
        <li>
          <a
            href="https://github.com/nputnam-hu/blogwise-landing"
            target="_blank"
            rel="noopener noreferrer"
          >
            blogwise-dash
          </a>
          : the original codebase for the landing page. Written with React,
          GatsbyJS, and sass.
        </li>
        <li>
          <a
            href="https://github.com/nputnam-hu/blogwise-template-1-canonical"
            target="_blank"
            rel="noopener noreferrer"
          >
            blogwise-template-1-canonical
          </a>
          : the original codebase for the blog template that was generated for
          different customers. Written with React, GatsbyJS, and sass.
        </li>
        <li>
          <a
            href="https://github.com/nputnam-hu/blogwise-api"
            target="_blank"
            rel="noopener noreferrer"
          >
            blogwise-api
          </a>
          : the original codebase for the blogwise RESTful API. Written with
          nodeJS, express, and PostgreSQL.
        </li>
        <li>
          <a
            href="https://github.com/nputnam-hu/blogwise-lib"
            target="_blank"
            rel="noopener noreferrer"
          >
            blogwise-lib
          </a>
          : General documentation base for the blogwise architecture
        </li>
      </ul>
    </div>
  </div>
)

export default Home
