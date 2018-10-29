import {
  SEARCH_SUGGESTION,
  CLEAR_SEARCH_SUGGESTION,
} from '../actions'

const defaultState = {
  loading: false,
  error: null,
  results: [],
}
export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case `${SEARCH_SUGGESTION}_LOADING`:
      return {
        ...prevState,
        error: null,
        loading: false,
      }
    case `${SEARCH_SUGGESTION}_FAILURE`:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case `${SEARCH_SUGGESTION}_SUCCESS`:
      return {
        ...prevState,
        results: payload,
        loading: false,
      }
    case CLEAR_SEARCH_SUGGESTION:
      return defaultState
    default:
      return prevState
  }
}
