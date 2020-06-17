import { Toaster, Position, Intent } from '@blueprintjs/core'

const toaster = Toaster.create()

export default function errorMessage(message) {
  return toaster.show({
    message,
    position: Position.TOP,
    intent: Intent.DANGER,
  })
}

export function alertUser(message) {
  return toaster.show({
    message,
    position: Position.TOP,
    intent: Intent.SUCCESS,
    icon: 'confirm',
  })
}

export function validateState(keys, state) {
  // eslint-disable-next-line no-restricted-syntax
  for (const el of keys) {
    let key = el
    let error = el
    // can optionall pass in array of arrays for custom err messages
    if (Array.isArray(el)) {
      const [keyName, errorName] = el
      key = keyName
      error = errorName
    }
    if (!state[key]) {
      errorMessage(`Missing field: ${error}`)
      return false
    }
  }
  return true
}
