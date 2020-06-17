import React from 'react'
import Bookmark from './icons/bookmark'
import Checkmark from './icons/checkmark'
import Upload from './icons/upload'
import Gear from './icons/gear'
import Pencil from './icons/pencil'
import Plus from './icons/plus'
import InviteUser from './icons/inviteUser'
import ArrowRight from './icons/arrowRight'
import ImageBank from './icons/imageBank'
import ArrowRightLarge from './icons/arrowRightLarge'
import './styles.sass'

const genIcon = icon => {
  if (!icon) {
    return null
  }
  switch (icon) {
    case 'gear':
      return Gear
    case 'bookmark':
      return Bookmark
    case 'checkmark':
      return Checkmark
    case 'upload':
      return Upload
    case 'pencil':
      return Pencil
    case 'plus':
      return Plus
    case 'inviteUser':
      return InviteUser
    case 'arrowRight':
      return ArrowRight
    case 'imageBank':
      return ImageBank
    case 'arrowRightLarge':
      return ArrowRightLarge
    default:
      console.warn('Invalid icon prop given, ignored')
      return null
  }
}

const genButtonStyle = large =>
  large
    ? {
        padding: '12px 15px',
        fontSize: '14px',
      }
    : {
        padding: '8px 12px',
        fontSize: '13px',
      }

const BlueButton = ({
  icon,
  rightIcon,
  children,
  text,
  onClick,
  large = false,
  style,
  className,
  ...rest
}) => {
  const IconComponent = genIcon(icon)
  const RightIconComponent = genIcon(rightIcon)
  return (
    <button
      className={`bluebutton${className ? ` ${className}` : ''}`}
      onClick={onClick}
      style={{ ...genButtonStyle(large), ...style }}
      {...rest}
    >
      {IconComponent && <IconComponent />}
      {text || null}
      {children}
      {RightIconComponent && <RightIconComponent className="right" />}
    </button>
  )
}

export default BlueButton
