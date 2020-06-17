import React, { Component } from 'react'
import {
  Spinner,
  Card,
  Elevation,
  Intent,
  Dialog,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core'
import isValidDomain from 'is-valid-domain'
import QuestionHint from '../../../../../../components/QuestionHint'
import Client from '../../../../../../client'
import errorMessage from '../../../../../../toaster'
import settingsIcon from './settingsIcon.svg'
import './styles.sass'
import BlueButton from '../../../../../../components/BlueButton'

function getRecordNameFromUrl(url) {
  const urlParts = url.split('.')
  if (urlParts.length < 3) {
    return null
  }
  urlParts.splice(-2)
  return urlParts.join('.')
}

function getRecordValueFromUrl(url) {
  return `${url.replace(/https:\/\//g, '')}.`
}

class DomainSettings extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      siteUrl: '',
      newSiteUrl: '',
      netlifyUrl: '',
      sslActivated: false,
      dataLoading: true,
      modalOpen: false,
    }
  }
  componentDidMount() {
    this.client.get('/blogs').then(blog => {
      this.client.get('/instances').then(instance => {
        this.setState({
          siteUrl: blog.siteUrl,
          netlifyUrl: instance.netlifyUrl,
          sslActivated: blog.sslActivated,
          dataLoading: false,
        })
      })
    })
  }
  onClick = () => {
    this.setState({ modalOpen: true })
  }
  onKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      this.updateSiteUrl()
    }
  }
  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }
  updateSiteUrl = () => {
    if (getRecordNameFromUrl(this.state.newSiteUrl) === null) {
      return errorMessage(
        'blogwise does not support root domains, please input a subdomain such as `blog.example.com`',
      )
    }
    if (!isValidDomain(this.state.newSiteUrl)) {
      return errorMessage(
        'Invalid domain inputted, please be sure to not put in any special characters or `https://`',
      )
    }
    return this.client
      .put('/blogs', { siteUrl: this.state.newSiteUrl, sslActivated: false })
      .then(() => {
        this.setState({
          siteUrl: this.state.newSiteUrl,
          sslActivated: false,
          modalOpen: false,
        })
        this.client.put('/blogs/dns')
      })
  }
  activateSSL = () => {
    this.client
      .put('/blogs', { sslActivated: true })
      .then(() => this.setState({ sslActivated: true }))
    this.client.post('/blogs/ssl')
  }
  render() {
    return (
      <>
        <div id="domainsettings-container">
          <div className="section-header myblog">
            <img src={settingsIcon} alt="Settings" />
            <div style={{ width: '10px' }} />
            <h2>Domain Settings</h2>
            <QuestionHint
              title="Domain Settings"
              helperText="Domain settings lets you configure a custom domain name for your blog. We recommend that you set it as subdomain of the domain you have for your main site. So if you have example.com registered, then you can set your blog to blog.example.com"
            />
          </div>
          {this.state.dataLoading ? (
            <Spinner />
          ) : (
            <Card className="domain-card" elevation={Elevation.ONE}>
              <p>
                Your blog is currently hosted at <br />
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://${this.state.siteUrl}`}
                >
                  {this.state.siteUrl}
                </a>
              </p>
              <BlueButton
                onClick={this.onClick}
                style={{ alignSelf: 'center' }}
              >
                Change
              </BlueButton>
            </Card>
          )}
          {this.state.siteUrl !== this.state.netlifyUrl && (
            <div>
              <br />
              <h3>Confirm Custom Domain</h3>
              <p>
                Go to your domain provider and create the following record to
                complete the domain hosting process.
              </p>
              <table className="bp3-html-table bp3-html-table-striped">
                <thead>
                  <tr>
                    <th>Record Type</th>
                    <th>Name/Host</th>
                    <th>Value/Points To</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>CNAME</td>
                    <td>{getRecordNameFromUrl(this.state.siteUrl)}</td>
                    <td>{getRecordValueFromUrl(this.state.netlifyUrl)}</td>
                  </tr>
                </tbody>
              </table>
              <br />
              <p>
                Need help? Consult the following guides for how to create a
                record based off of your domain provider:
              </p>
              <ul>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.godaddy.com/help/add-a-cname-record-19236"
                  >
                    GoDaddy
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://www.name.com/support/articles/115004895548-Adding-a-CNAME-Record"
                  >
                    Name.com
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://support.cloudflare.com/hc/en-us/articles/360020615111-Configuring-a-CNAME-setup"
                  >
                    Cloudflare
                  </a>
                </li>
              </ul>
              <br />
              <h3>Activate SSL</h3>
              <p>
                Once you have entered the records into your domain provder,
                click below to activate SSL for your website. SSL increases your
                blog's security, and will show up as `Secure` in Web Browsers.
              </p>
              <BlueButton
                onClick={this.activateSSL}
                intent={
                  this.state.sslActivated ? Intent.SUCCESS : Intent.PRIMARY
                }
                icon={this.state.sslActivated && 'checkmark'}
                locked={this.state.sslActivated}
              >
                {this.state.sslActivated ? 'SSL Acctivated' : 'Activate SSL'}
              </BlueButton>
            </div>
          )}
        </div>
        {/* Modals */}
        <Dialog
          icon="exchange"
          isOpen={this.state.modalOpen}
          onClose={this.handleModalClose}
          onOpening={() => this.setState({ newSiteUrl: this.state.siteUrl })}
          title="Update Domain Name"
        >
          <div id="updatedomain-modal">
            <FormGroup
              htmlFor="siteUrl"
              label="Site Domain"
              helperText="Please input just the URL with no `https://`"
            >
              <InputGroup
                name="siteUrl"
                placeholder="blog.example.com"
                value={this.state.newSiteUrl}
                onKeyDown={this.onKeyDown}
                onChange={e => this.setState({ newSiteUrl: e.target.value })}
              />
            </FormGroup>
            <BlueButton icon="checkmark" onClick={this.updateSiteUrl}>
              Confirm
            </BlueButton>
          </div>
        </Dialog>
      </>
    )
  }
}

export default DomainSettings
