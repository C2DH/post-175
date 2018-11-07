import {
  GET_TIME_SERIES,
  GET_TIME_SERIES_UNLOAD,
} from '../actions'

const defaultState = {
  data: null,
  loading: false,
  error: null,
}

export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case `${GET_TIME_SERIES}_SUCCESS`:
      return {
        ...prevState,
        loading: false,
        data: payload,
      }
    case `${GET_TIME_SERIES}_LOADING`:
      return {
        ...prevState,
        loading: true,
        error: null,
      }
    case `${GET_TIME_SERIES}_FAILURE`:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case GET_TIME_SERIES_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
