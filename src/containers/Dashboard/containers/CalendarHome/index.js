import React, { Component } from 'react'
import FullCalendar from 'fullcalendar-reactwrapper'
import { Spinner } from '@blueprintjs/core'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import moment from 'moment'
import Client from '../../../../client'
import errorMessage, { validateState } from '../../../../toaster'
import BlueButton from '../../../../components/BlueButton'
import EventModal from './EventModal'
import './styles.sass'

function mapPostsToFullCalendarEvents(posts) {
  return posts.map(post => ({
    title: post.title,
    id: post.id,
    tags: post.tags,
    start: post.dueDate,
    end: post.dueDate,
    authorId: post.author,
  }))
}

class CalendarHome extends Component {
  constructor() {
    super()
    this.client = new Client()
    this.state = {
      headlines: [],
      tweets: [],
      posts: [],
      tagNames: [],
      editEventModalOpen: false,
      eventToEdit: {},
      dataLoading: true,
    }
  }
  componentDidMount() {
    this.client.post('/blogs/content').then(({ headlines, tweets }) => {
      this.client.get('/calendars/posts').then(posts => {
        this.setState({
          tweets,
          headlines,
          posts,
          dataLoading: false,
        })
      })
    })
  }
  openEventModal = event => {
    this.setState({
      editEventModalOpen: true,
      eventToEdit: {
        id: event.id || '',
        title: event.title || '',
        tags: event.tags || [],
        authorId: event.authorId || '',
        dueDate: event.start || null,
      },
    })
  }
  closeEventModal = () => {
    this.setState({
      editEventModalOpen: false,
      eventToEdit: {},
    })
  }
  submitEvent = async state => {
    try {
      if (
        !validateState([['title', 'Headline'], ['dueDate', 'Due Date']], state)
      ) {
        return
      }
      let post
      if (state.id) {
        post = await this.client.put('/calendars/posts', {
          id: state.id,
          post: {
            tags: state.tags,
            authorId: state.authorId ? state.authorId.value : null,
            title: state.title,
            dueDate: state.dueDate,
          },
        })
      } else {
        post = await this.client.post('/calendars/posts', {
          tags: state.tags,
          authorId: state.authorId ? state.authorId.value : null,
          title: state.title,
          dueDate: state.dueDate,
        })
      }
      const newPosts = [...this.state.posts.filter(p => p.id !== post.id), post]
      this.setState({ posts: newPosts })
      this.closeEventModal()
    } catch (err) {
      console.error(err)
      errorMessage('There was a problem saving your event')
    }
  }
  render() {
    return (
      <>
        <div id="calendarhome-container">
          {/* <Button
          small
          icon="arrow-left"
          minimal
          onClick={() => this.props.history.push('/dashboard/postgenius')}
        >
          Back to Post Genius
        </Button> */}
          <div id="calendar-wrapper">
            {/* <h1>Editorial Calendar</h1> */}
            {this.state.dataLoading ? (
              <Spinner />
            ) : (
              <div className="calendarhome__content">
                <div className="calendarhome__calendar">
                  <FullCalendar
                    id="fullcalendar"
                    defaultView="month"
                    duration={{ days: 30 }}
                    // height={600}
                    customButtons={{
                      newPost: {
                        text: 'New Post',
                        click: () => this.openEventModal({}),
                      },
                    }}
                    buttonText={{
                      today: 'Today',
                    }}
                    header={{
                      left: 'today prev,next title',
                      center: '',
                      right: 'newPost',
                    }}
                    events={mapPostsToFullCalendarEvents(this.state.posts)}
                    eventClick={this.openEventModal}
                    eventRender={(event, element, view) => {
                      const dateString = moment(event.start).format(
                        'YYYY-MM-DD',
                      )
                      view.el
                        .find(`.fc-day[data-date="${dateString}"]`)
                        .addClass('has-event')
                    }}
                  />
                </div>
                <div className="calendarhome__right">
                  {this.state.tweets.length > 0 && (
                    <div className="calendarhome__headlines">
                      <h2>Tweets</h2>
                      <div className="calendarhome__tweets">
                        {this.state.tweets.map(({ id }) => (
                          <TwitterTweetEmbed
                            key={id}
                            tweetId={id}
                            // style={{ width: '100%' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ height: '20px' }} />
                  <div className="calendarhome__headlines">
                    <h2>Suggested Articles</h2>
                    {this.state.headlines.length === 0 ? (
                      <div
                        style={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <p>
                          You need to create at least one tag to enable this
                          feature
                        </p>
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
                      <div>
                        {this.state.headlines.map(headline => (
                          <button
                            onClick={() =>
                              this.openEventModal({ title: headline })
                            }
                            className="headline__button"
                          >
                            <span className="headline">{headline}</span>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g id="icon/navigation/chevron_right_24px">
                                <path
                                  id="icon/navigation/chevron_right_24px_2"
                                  d="M9.41 18.6666L8 17.2566L12.58 12.6666L8 8.07663L9.41 6.66663L15.41 12.6666L9.41 18.6666Z"
                                  fill="#767676"
                                />
                              </g>
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Modals */}
        <EventModal
          history={this.props.history}
          isOpen={this.state.editEventModalOpen}
          handleClose={this.closeEventModal}
          defaultState={this.state.eventToEdit}
          submitEvent={this.submitEvent}
          client={this.client}
        />
      </>
    )
  }
}

export default CalendarHome
