import {
  TIMELINE_SET_DATE,
  TIMELINE_UNLOAD,
} from '../actions'
const defaultState = {
  currentDate: null,
}
export default (prevState = defaultState, { type, payload }) => {
  switch (type) {
    case TIMELINE_SET_DATE:
      return {
        ...prevState,
        currentDate: payload,
      }
    case TIMELINE_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
