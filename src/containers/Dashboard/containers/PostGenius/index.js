import React, { Component } from 'react'
import {
  Button,
  Spinner,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import moment from 'moment'
import BlueButton from '../../../../components/BlueButton'
import QuestionHint from '../../../../components/QuestionHint'
import Client from '../../../../client'
import robot from '../../postgenius.svg'
import './styles.sass'

const Robot = ({ children }) => (
  <div id="robot-container">
    <div className="speechbubble">{children}</div>
    <img src={robot} alt="Post Genius Robot" className="postgenius-robot" />
  </div>
)

class PostGenius extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      headlines: [],
      latestPost: {},
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.post('/blogs/content').then(headlines => {
      this.client.get('/calendars/posts/next').then(latestPost => {
        this.setState({
          headlines,
          latestPost,
          dataLoading: false,
        })
      })
    })
  }
  render() {
    const { headlines, latestPost } = this.state
    const latestPostExists = latestPost && Object.keys(latestPost).length > 0
    return (
      <div id="postgenius-container">
        {this.state.dataLoading ? (
          <Spinner />
        ) : (
          <>
            <Robot>
              {!latestPostExists ? (
                <>
                  <p>
                    Looks like you haven't scheduled any posts yet. Would you
                    like to create a new content strategy?
                  </p>

                  <br />
                  <div className="emptystate__buttoncontainer">
                    <BlueButton
                      large
                      icon="plus"
                      onClick={() => this.props.history.push('/calendar/new')}
                    >
                      New Strategy
                    </BlueButton>
                    <QuestionHint
                      title="Content Strategies"
                      helperText="Content strategies help you plan out your blog posts into advance to achieve your marketing and branding goals. First, brainstorm posts to write and then we'll schedule them out over a specified time range. Then we'll send out email reminders with content suggestions and inspiration to help you start writing."
                      style={{ marginTop: '15px' }}
                      iconSize={19}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Your next scheduled post is <b>{latestPost.title.trim()}</b>
                    , tagged{' '}
                    {latestPost.tags.map((t, i) => (
                      <i key={t.value}>
                        {t.label}
                        {i !== latestPost.tags.length - 1 ? ', ' : '. '}
                      </i>
                    ))}
                    It is scheduled for{' '}
                    {moment(latestPost.dueDate).format('LL')}.
                  </p>
                  <div className="firstpost__buttons">
                    <BlueButton
                      onClick={() =>
                        this.props.history.push('/posts/new', {
                          tags: this.state.latestPost.tags,
                          title: this.state.latestPost.title,
                        })
                      }
                      icon="pencil"
                      large
                    >
                      Write This Post
                    </BlueButton>
                    <div style={{ width: '5px' }} />
                    <BlueButton
                      large
                      icon="bookmark"
                      onClick={() => this.props.history.push('/calendar')}
                    >
                      Manage Scheduled Posts
                    </BlueButton>
                  </div>
                </>
              )}
            </Robot>
            <div style={{ height: '40px' }} />
            <div className="postgenius__bottomcontent">
              <div className="bottomcontent__col">
                <div className="section-header">
                  <h2>Suggested Articles</h2>
                </div>
                {headlines.length === 0 ? (
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h3>
                      You need to create at least one tag to enable this feature
                    </h3>
                    <BlueButton
                      onClick={() =>
                        this.props.history.push('/dashboard/myblog', {
                          tabId: 'second',
                        })
                      }
                    >
                      Create your first tag
                    </BlueButton>
                  </div>
                ) : (
                  <ul>
                    {headlines.map(headline => (
                      <>
                        <Popover
                          interactionKind={PopoverInteractionKind.HOVER}
                          position={Position.TOP}
                          key={headline}
                        >
                          <li className="listel">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="headline__bullet"
                            >
                              <g id="icon/action/turned_in_not_24px">
                                <path
                                  id="icon/action/turned_in_not_24px_2"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M5.25 2.25H12.75C13.575 2.25 14.25 2.925 14.25 3.75V15.75L9 13.5L3.75 15.75L3.7575 3.75C3.7575 2.925 4.425 2.25 5.25 2.25ZM9.00012 11.865L12.7501 13.5V3.74999H5.25012V13.5L9.00012 11.865Z"
                                  fill="#888888"
                                  fillOpacity="0.54"
                                />
                              </g>
                            </svg>
                            {/* <div className="headline-container"> */}
                            <span className="headline">{headline}</span>
                            {/* </div> */}
                          </li>
                          <Button
                            rightIcon="document-open"
                            onClick={() =>
                              this.props.history.push('/posts/new', {
                                title: headline,
                              })
                            }
                          >
                            {' '}
                            Write This
                          </Button>
                        </Popover>
                        <br />
                      </>
                    ))}
                  </ul>
                )}
              </div>
              {latestPostExists && (
                <>
                  <div style={{ width: '30px', height: '30px' }} />
                  <div className="bottomcontent__col">
                    <div className="section-header">
                      <h2>
                        Tweets Relevant to <i>{latestPost.title}</i>
                      </h2>
                    </div>
                    <div className="bottomcontent__tweets">
                      {latestPost.relevantTweets.map(({ id }) => (
                        <TwitterTweetEmbed
                          key={id}
                          tweetId={id}
                          style={{ width: '100%' }}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    )
  }
}

export default PostGenius
