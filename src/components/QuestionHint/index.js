import React from 'react'
import { Icon, Popover, PopoverInteractionKind, H5 } from '@blueprintjs/core'

import './styles.sass'

const QuestionHint = ({ title, helperText, style }) => (
  <Popover interactionKind={PopoverInteractionKind.HOVER}>
    <Icon
      icon="help"
      iconSize={15}
      style={{ ...style, color: 'rgba(0, 0, 0, 0.22)' }}
    />
    <div id="popover-container">
      <H5>{title}</H5>
      <p>{helperText}</p>
    </div>
  </Popover>
)

export default QuestionHint
