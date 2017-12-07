import {
  SELECT_EVENT,
  CLEAR_SELECTED_EVENT,
  GET_EVENT_LOADING,
  GET_EVENT_FAILURE,
  GET_EVENT_SUCCESS,
} from '../actions'

const defaultState = {
  event: null,
  eventDetail: null,
  loading: false,
  error: null,
}
export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case SELECT_EVENT:
      return {
        event: payload,
        eventDetail: null,
        loading: false,
        error: null,
      }
    case GET_EVENT_LOADING:
      return {
        ...prevState,
        loading: true,
      }
    case GET_EVENT_FAILURE:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case GET_EVENT_SUCCESS:
      return {
        ...prevState,
        eventDetail: payload,
        loading: false,
      }
    case CLEAR_SELECTED_EVENT:
      return defaultState
    default:
      return prevState
  }
}
