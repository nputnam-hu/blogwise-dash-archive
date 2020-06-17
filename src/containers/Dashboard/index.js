import React, { Component } from 'react'
import {
  Popover,
  Icon,
  H5,
  PopoverInteractionKind,
  Spinner,
} from '@blueprintjs/core'
import { Elements } from 'react-stripe-elements'
import { Link } from 'react-router-dom'
import store from 'store'
import Account from './containers/Account'
import Overview from './containers/Overview'
import MyBlog from './containers/MyBlog'
import MyPosts from './containers/MyPosts'
import PostGenius from './containers/PostGenius'
import CalendarHome from './containers/CalendarHome'
import PaymentDash from './containers/PaymentDash'
import Social from './containers/Social'
import WriterHome from '../Writer/WriterHome'
import Client from '../../client'
import errorMessage, { alertUser } from '../../toaster'
import './styles.sass'

class Dashboard extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      hasUpdates: false,
      dataSending: false,
    }
  }
  componentDidMount() {
    const hasUpdates = store.get('hasUpdates')
    if (!hasUpdates) {
      this.client
        .get('/blogs/updates')
        .then(blogHasUpdates => store.set('hasUpdates', blogHasUpdates))
    }
  }
  onClick = async () => {
    this.setState({ dataSending: true })
    try {
      await this.client.post('/blogs/deploy')
      store.set('hasUpdates', false)
      alertUser('Success! Updates are building on our servers right now')
    } catch (err) {
      errorMessage('Error publishing updates')
    } finally {
      this.setState({ dataSending: false })
    }
  }
  render() {
    const { children, activeTab } = this.props
    const hasUpdates = store.get('hasUpdates')
    const isAdmin = store.get('user').type === 'ADMIN'
    return (
      <div id="index-container" className="tab-container">
        <div className="dashboard">
          <div className="dashboard__tabs">
            {isAdmin ? (
              <Link
                className={`dashboard-tabs__tab ${
                  activeTab === 'overview' ? 'active' : ''
                }`}
                to="/dashboard"
              >
                Overview
              </Link>
            ) : (
              <Link
                className={`dashboard-tabs__tab ${
                  activeTab === 'writer' ? 'active' : ''
                }`}
                to="/writer"
              >
                Home
              </Link>
            )}
            {isAdmin && (
              <Link
                className={`dashboard-tabs__tab ${
                  activeTab === 'myblog' ? 'active' : ''
                }`}
                to="/dashboard/myblog"
              >
                My Blog
              </Link>
            )}
            <Link
              className={`dashboard-tabs__tab ${
                activeTab === 'myposts' ? 'active' : ''
              }`}
              to="/dashboard/myposts"
            >
              My Posts
            </Link>
            <Link
              className={`dashboard-tabs__tab ${
                activeTab === 'postgenius' ? 'active' : ''
              }`}
              to="/dashboard/calendar"
            >
              Editorial Calendar
            </Link>
            {isAdmin && (
              <Link
                className={`dashboard-tabs__tab ${
                  activeTab === 'account' ? 'active' : ''
                }`}
                to="/dashboard/account"
              >
                Account
              </Link>
            )}
          </div>
          {this.state.dataSending ? (
            <Spinner size={Spinner.SIZE_SMALL} />
          ) : (
            <div
              className="publishupdates"
              style={{ visibility: hasUpdates ? 'visible' : 'hidden' }}
            >
              <button onClick={this.onClick}>Publish Updates</button>
              <Popover
                interactionKind={PopoverInteractionKind.HOVER}
                className="publishupdates__popover"
              >
                <Icon
                  icon="help"
                  iconSize={15}
                  style={{
                    marginLeft: '-25px',
                  }}
                />
                <div id="popover-container">
                  <H5>Publish Updates</H5>
                  <p>
                    When you make changes to your blog on the admin dashboard,
                    they are saved, but not published to your live blog
                    immediately. Once you are done making changes, click
                    `Publish Updates` to make your changes live. Each update
                    takes about 2 minutes to be published live.
                  </p>
                </div>
              </Popover>
            </div>
          )}
        </div>
        <div className="tab-content">{children}</div>
      </div>
    )
  }
}
export const OverviewView = props => (
  <Dashboard activeTab="overview">
    <Overview {...props} />
  </Dashboard>
)

export const MyBlogView = props => (
  <Dashboard activeTab="myblog">
    <MyBlog {...props} />
  </Dashboard>
)

export const MyPostsView = props => (
  <Dashboard activeTab="myposts">
    <MyPosts {...props} />
  </Dashboard>
)

export const PostGeniusView = props => (
  <Dashboard activeTab="postgenius">
    <PostGenius {...props} />
  </Dashboard>
)

export const AccountView = props => (
  <Dashboard activeTab="account">
    <Elements>
      <Account {...props} />
    </Elements>
  </Dashboard>
)

export const CalendarView = props => (
  <Dashboard activeTab="postgenius">
    <CalendarHome {...props} />
  </Dashboard>
)

export const PaymentDashView = props => (
  <Dashboard activeTab="account">
    <PaymentDash {...props} />
  </Dashboard>
)

export const WriterView = props => (
  <Dashboard activeTab="writer">
    <WriterHome {...props} />
  </Dashboard>
)

export const SocialView = props => (
  <Dashboard>
    <Social {...props} />
  </Dashboard>
)
