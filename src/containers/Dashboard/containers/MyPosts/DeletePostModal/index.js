import React from 'react'
import { Alert, Intent } from '@blueprintjs/core'

const DeletePostModal = ({ isOpen, handleClose, cancelDelete, deletePost }) => (
  <Alert
    isOpen={isOpen}
    icon="warning-sign"
    intent={Intent.DANGER}
    onClose={handleClose}
    onCancel={cancelDelete}
    onConfirm={deletePost}
    cancelButtonText="Cancel"
    confirmButtonText="Delete Post"
  >
    <p>
      Are you sure you want to delete this blog post? This will delete the
      article from your blog and this dashboard and is not reversible.
    </p>
  </Alert>
)

export default DeletePostModal
