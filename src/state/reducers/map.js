import {
  MAP_TIMELINE_SET_DATE,
  MAP_UNLOAD,
  MAP_SET_OVER_PLACE,
  MAP_CLEAR_OVER_PLACE,
  MAP_SET_SELECTED_PLACE,
  MAP_CLEAR_SELECTED_PLACE,
} from '../actions'
const defaultState = {
  currentDate: null,
  overPlace: null,
  selectedPlace: null,
}
export default (prevState = defaultState, { type, payload }) => {
  switch (type) {
    case MAP_TIMELINE_SET_DATE:
      return {
        ...prevState,
        currentDate: payload,
      }
    case MAP_SET_OVER_PLACE: {
      // Prevent to over a selected shit
      if (prevState.selectedPlace && prevState.selectedPlace.id === payload.id) {
        return prevState
      }
      return {
        ...prevState,
        overPlace: payload,
      }
    }
    case MAP_CLEAR_OVER_PLACE:
      return {
        ...prevState,
        overPlace: null,
      }
    case MAP_SET_SELECTED_PLACE:
      return {
        ...prevState,
        overPlace: null,
        selectedPlace: payload,
      }
    case MAP_CLEAR_SELECTED_PLACE:
      return {
        ...prevState,
        selectedPlace: null,
      }
    case MAP_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
