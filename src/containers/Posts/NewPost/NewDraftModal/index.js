import React from 'react'
import { Alert, Intent } from '@blueprintjs/core'

const NewDraftModal = ({ isOpen, handleClose, saveAsDraft, deletePost }) => (
  <Alert
    isOpen={isOpen}
    icon="warning-sign"
    intent={Intent.DANGER}
    onClose={handleClose}
    onCancel={saveAsDraft}
    onConfirm={deletePost}
    cancelButtonText="Save as Draft"
    confirmButtonText="Discard Post"
  >
    <p>Do you want to discard this post or save as a draft?</p>
  </Alert>
)

export default NewDraftModal
