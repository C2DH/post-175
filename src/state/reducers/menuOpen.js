import {
  TOGGLE_MENU_OPEN,
  SET_MENU_OPEN,
} from '../actions'

export default (prevState = false, { type, paylad }) => {
  switch (type) {
    case TOGGLE_MENU_OPEN:
      return !prevState
    case SET_MENU_OPEN:
      return paylad
    default:
      return prevState
  }
}
