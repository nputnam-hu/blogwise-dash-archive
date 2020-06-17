import React from 'react'
import { Alert } from '@blueprintjs/core'

const CropChoiceModal = ({ isOpen, handleClose, onAccept, onReject }) => (
  <Alert
    isOpen={isOpen}
    onClose={handleClose}
    onCancel={onReject}
    onConfirm={onAccept}
    cancelButtonText="Upload without cropping"
    confirmButtonText="Crop"
  >
    <p>Do you want to crop your photo?</p>
  </Alert>
)

export default CropChoiceModal
