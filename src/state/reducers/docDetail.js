import {
  GET_DOCUMENT,
  GET_DOCUMENT_UNLOAD,
} from '../actions'

const defaultState = {
  data: null,
  loading: false,
  error: null,
}

export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case `${GET_DOCUMENT}_SUCCESS`:
      return {
        ...prevState,
        loading: false,
        data: payload,
      }
    case `${GET_DOCUMENT}_LOADING`:
      return {
        ...prevState,
        loading: true,
        error: null,
      }
    case `${GET_DOCUMENT}_FAILURE`:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case GET_DOCUMENT_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
