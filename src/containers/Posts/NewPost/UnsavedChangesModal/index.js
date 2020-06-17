import React from 'react'
import { Alert, Intent } from '@blueprintjs/core'

const UnsavedChangesModal = ({ isOpen, handleClose, discardChanges }) => (
  <Alert
    isOpen={isOpen}
    icon="warning-sign"
    intent={Intent.WARNING}
    onClose={handleClose}
    onCancel={handleClose}
    onConfirm={discardChanges}
    cancelButtonText="Cancel"
    confirmButtonText="Discard Changes"
  >
    <p>
      You have unsaved changes. Do you want to discard these changes or continue
      on this page?
    </p>
  </Alert>
)

export default UnsavedChangesModal
