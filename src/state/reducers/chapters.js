import {
  GET_CHAPTERS_SUCCESS,
  GET_CHAPTERS_LOADING,
  GET_CHAPTERS_FAILURE,
  GET_CHAPTERS_UNLOAD,
} from '../actions'

const defaultState = {
  data: null,
  loading: false,
  error: null,
}

export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case GET_CHAPTERS_SUCCESS:
      return {
        ...prevState,
        loading: false,
        data: payload,
      }
    case GET_CHAPTERS_LOADING:
      return {
        ...prevState,
        loading: true,
        error: null,
      }
    case GET_CHAPTERS_FAILURE:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case GET_CHAPTERS_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
