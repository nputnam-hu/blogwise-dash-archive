import React from 'react'
import {
  Button,
  Popover,
  Menu,
  MenuItem,
  Position,
  Intent,
  Icon,
  Spinner,
} from '@blueprintjs/core'
import './styles.sass'

const PostNavbar = ({
  hasBeenPublished,
  backtoDash,
  savingPost,
  postLastSaved,
  saveDraft,
  publishNow,
  schedulePublish,
  unpublishPost,
  scheduledPublishDate,
  cancelSchedulePublish,
}) => {
  let title
  if (scheduledPublishDate) {
    title = `Scheduled for ${scheduledPublishDate.format('LLLL')}`
  } else if (hasBeenPublished) {
    title = `Post Published`
  } else {
    title = `Save and Publish`
  }
  return (
    <div className="postnavbar">
      <Button
        onClick={backtoDash}
        minimal
        icon="arrow-left"
        large
        className="postnavbar__backbutton"
      >
        Back to Dashboard
      </Button>
      <div
        style={{
          borderRight: '2px solid lightgrey',
          width: '0px',
          height: '70px',
        }}
      />
      <div className="pastnavbar__rightpart">
        {/* eslint-disable-next-line no-nested-ternary */}
        {savingPost ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Updating post...
            <Spinner size={Spinner.SIZE_SMALL} />
          </div>
        ) : postLastSaved ? (
          <div>
            Post last saved at {postLastSaved.format('LT')} <Icon icon="tick" />
          </div>
        ) : (
          ''
        )}
        <Popover
          position={Position.BOTTOM_RIGHT}
          className="pastnavbar__savebutton"
        >
          <Button intent={Intent.PRIMARY} large rightIcon="caret-down">
            {title}
          </Button>
          <Menu large>
            {hasBeenPublished ? (
              <>
                <MenuItem
                  icon="send-to"
                  text="Publish Updates"
                  onClick={publishNow}
                />
                <MenuItem
                  icon="document"
                  text="Unpublish Post"
                  onClick={unpublishPost}
                />
              </>
            ) : (
              <>
                <MenuItem
                  icon="document"
                  text="Save as a draft"
                  onClick={saveDraft}
                />
                <MenuItem
                  icon="send-to"
                  text="Publish Right Now"
                  onClick={publishNow}
                />
                {scheduledPublishDate ? (
                  <MenuItem
                    icon="cross"
                    text="Cancel Scheduled Publish"
                    onClick={cancelSchedulePublish}
                  />
                ) : (
                  <MenuItem
                    icon="time"
                    text="Schedule Publish Time"
                    onClick={schedulePublish}
                  />
                )}
              </>
            )}
          </Menu>
        </Popover>
      </div>
    </div>
  )
}
export default PostNavbar
