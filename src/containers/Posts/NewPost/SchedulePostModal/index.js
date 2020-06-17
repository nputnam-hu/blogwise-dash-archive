import React, { Component } from 'react'
import moment from 'moment'
import { Dialog, Button, FormGroup, Intent, Tag } from '@blueprintjs/core'
import { DatePicker, TimePrecision } from '@blueprintjs/datetime'
import './styles.sass'

const MomentDate = ({ date, format }) => {
  const m = moment(date)
  if (m.isValid()) {
    return <Tag intent={Intent.PRIMARY}>{m.format(format)}</Tag>
  }
  return <div />
}

class SchedulePostModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduledPublishDate: null,
    }
  }
  render() {
    const { isOpen, handleClose } = this.props
    return (
      <Dialog
        icon="calendar"
        isOpen={isOpen}
        onClose={handleClose}
        title="Schedule Post Publish"
      >
        <div className="schedulepost">
          <FormGroup htmlFor="scheduledPublishDate" label="Publish Time">
            <DatePicker
              name="scheduledPublishDate"
              minDate={new Date()}
              timePrecision={TimePrecision.MINUTE}
              timePickerProps={{ showArrowButtons: true, useAmPm: true }}
              value={this.state.scheduledPublishDate}
              onChange={scheduledPublishDate =>
                this.setState({ scheduledPublishDate })
              }
            />
          </FormGroup>
          {this.state.scheduledPublishDate && (
            <div className="schedulepost__date">
              <span>Scheduled for:</span>
              <br />
              <MomentDate
                date={this.state.scheduledPublishDate}
                format="LLLL"
              />
            </div>
          )}
          <Button
            icon="calendar"
            large
            intent={Intent.PRIMARY}
            text="Schedule Post"
            onClick={() =>
              this.props.schedulePostPublish(this.state.scheduledPublishDate)
            }
          />
        </div>
      </Dialog>
    )
  }
}

export default SchedulePostModal
