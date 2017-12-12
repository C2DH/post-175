import {
  SELECT_EVENT,
  CLEAR_SELECTED_EVENT,
} from '../actions'

export default (prevState = null, { type, payload }) => {
  switch (type) {
    case SELECT_EVENT:
      return payload
    case CLEAR_SELECTED_EVENT:
      return null
    default:
      return prevState
  }
}
