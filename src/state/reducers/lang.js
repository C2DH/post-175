import { SET_SELECTED_LANG } from '../actions'

const defaultState = {
  list: [],
  selected: null,
}

export default (prevState = defaultState, { type, payload }) => {
  switch (type) {
    case SET_SELECTED_LANG:
      return {
        ...prevState,
        selected: payload,
      }
    default:
      return prevState
  }
}
