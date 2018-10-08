import {
  TIMELINE_SET_DATE,
  TIMELINE_UNLOAD,
  TIMELINE_TOGGLE_CATEGORY,
  TIMELINE_SET_CATEGORIES,
  TIMELINE_TOGGLE_MILESTONE,
  TIMELINE_SET_MILESTONE,
} from '../actions'
import { EVENT_COLORS } from '../../consts'

const defaultState = {
  currentDate: null,
  milestone: false,
  categories: Object.keys(EVENT_COLORS),
}
export default (prevState = defaultState, { type, payload }) => {
  switch (type) {
    case TIMELINE_SET_DATE:
      return {
        ...prevState,
        currentDate: payload,
      }
    case TIMELINE_SET_MILESTONE:
      return {
        ...prevState,
        milestone: payload,
      }
    case TIMELINE_TOGGLE_MILESTONE:
      return {
        ...prevState,
        milestone: !prevState.milestone,
      }
    case TIMELINE_SET_CATEGORIES:
      return {
        ...prevState,
        categories: payload,
      }
    case TIMELINE_TOGGLE_CATEGORY:
      return {
        ...prevState,
        categories: prevState.categories.indexOf(payload) === -1
          ? prevState.categories.concat(payload)
          : prevState.categories.filter(cat => cat !== payload)
      }
    case TIMELINE_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
