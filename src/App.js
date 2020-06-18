import React, { Component } from 'react'
import {
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom'
import { StripeProvider } from 'react-stripe-elements'
import store from 'store'
import moment from 'moment'
import config from './config'
import Navbar, { ReducedNavbar } from './components/Navbar'
import {
  OverviewView,
  MyBlogView,
  MyPostsView,
  AccountView,
  CalendarView,
  PaymentDashView,
  WriterView,
  SocialView,
} from './containers/Dashboard/'
import HomeHeader from './containers/EditAppearence/HomeHeader'
import Login from './containers/Login'
import WriterRegister from './containers/Writer/WriterRegister'
import WriterInfo from './containers/Writer/WriterInfo'
import Register from './containers/Onboarding/Register'
import GetInfo from './containers/Onboarding/GetInfo'
import Header from './containers/Onboarding/Header'
import Sidebar from './containers/Onboarding/Sidebar'
import Home from './containers/Home'
import HomeSidebar from './containers/EditAppearence/HomeSidebar'
import BlogNavbar from './containers/EditAppearence/BlogNavbar'
import ForgotPassword from './containers/ForgotPassword'
import ResetPassword from './containers/ResetPassword'
import Footer from './components/Footer'
import NewPost from './containers/Posts/NewPost'

const PrivateRoute = ({
  component: MainComponent,
  showNav = true,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => {
      store.set('user', { type: 'ADMIN', token: 'afeea' })
      return (
        <div style={{ position: 'relative' }}>
          {showNav && <Navbar />}
          <MainComponent {...props} />
          {showNav && <Footer />}
        </div>
      )
    }}
  />
)

const ReducedBar = ({ component: MainComponent, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <div>
        <ReducedNavbar />
        <MainComponent {...props} />
      </div>
    )}
  />
)

class App extends Component {
  componentDidMount() {
    window.intercomSettings = {
      app_id: 'bnz5sax3',
    }
    const s = document.createElement('script')
    s.innerHTML = `(function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/bnz5sax3';var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();`
    document.body.appendChild(s)
  }
  render() {
    return (
      <StripeProvider apiKey={config.stripeToken}>
        <Router>
          <div className="App">
            <Switch>
              <ReducedBar path="/writer/register" component={WriterRegister} />
              <ReducedBar path="/writer/onboarding/1" component={WriterInfo} />
              <PrivateRoute path="/writer" component={WriterView} />
              <ReducedBar path="/login" component={Login} />
              <ReducedBar path="/forgotpassword" component={ForgotPassword} />
              <ReducedBar path="/resetpassword" component={ResetPassword} />
              <ReducedBar path="/onboarding/3" component={Sidebar} />
              <ReducedBar path="/onboarding/2" component={Header} />
              <ReducedBar path="/onboarding/1" component={GetInfo} />
              <ReducedBar path="/register" component={Register} />
              <PrivateRoute
                showNav={false}
                path="/edit/header"
                component={HomeHeader}
              />
              <PrivateRoute
                showNav={false}
                path="/edit/sidebar"
                component={HomeSidebar}
              />
              <PrivateRoute
                showNav={false}
                path="/edit/navbar"
                component={BlogNavbar}
              />
              <PrivateRoute
                showNav={false}
                path="/posts/:id(new|[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})?"
                component={NewPost}
              />
              <PrivateRoute
                path="/dashboard/payment"
                component={PaymentDashView}
              />
              <PrivateRoute path="/dashboard/account" component={AccountView} />
              <PrivateRoute
                path="/dashboard/calendar"
                component={CalendarView}
              />
              <PrivateRoute path="/dashboard/social" component={SocialView} />
              <PrivateRoute path="/dashboard/myposts" component={MyPostsView} />
              <PrivateRoute path="/dashboard/myblog" component={MyBlogView} />
              <PrivateRoute path="/dashboard" component={OverviewView} />
              <ReducedBar path="/" component={Home} />
            </Switch>
          </div>
        </Router>
      </StripeProvider>
    )
  }
}

export default App
