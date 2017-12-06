import {
  MAP_TIMELINE_SET_DATE,
  MAP_UNLOAD,
} from '../actions'
const defaultState = {
  currentDate: null,
}
export default (prevState = defaultState, { type, payload }) => {
  switch (type) {
    case MAP_TIMELINE_SET_DATE:
      return {
        ...prevState,
        currentDate: payload,
      }
    case MAP_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
