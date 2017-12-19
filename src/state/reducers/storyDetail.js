import {
  GET_STORY_SUCCESS,
  GET_STORY_LOADING,
  GET_STORY_FAILURE,
  GET_STORY_UNLOAD,
} from '../actions'

const defaultState = {
  data: null,
  loading: false,
  error: null,
}

export default (prevState = defaultState, { type, payload, error }) => {
  switch (type) {
    case GET_STORY_SUCCESS:
      return {
        ...prevState,
        loading: false,
        data: payload,
      }
    case GET_STORY_LOADING:
      return {
        ...prevState,
        loading: true,
        error: null,
      }
    case GET_STORY_FAILURE:
      return {
        ...prevState,
        error,
        loading: false,
      }
    case GET_STORY_UNLOAD:
      return defaultState
    default:
      return prevState
  }
}
