import React from 'react'

export default ({ className }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`bluebutton__icon${className ? ` ${className}` : ''}`}
  >
    <g id="icon/navigation/chevron_right_24px">
      <path
        id="icon/navigation/chevron_right_24px_2"
        d="M7.0575 4L6 5.0575L9.435 8.5L6 11.9425L7.0575 13L11.5575 8.5L7.0575 4Z"
        fill="#447ADC"
      />
    </g>
  </svg>
)
