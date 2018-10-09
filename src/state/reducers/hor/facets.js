const makeFacets = (actionType) => {

  const defaultState = {
    loading: false,
    error: null,
    data: null,
  }

  const reducer = (prevState = defaultState, { type, payload, error }) => {
    switch (type) {
      case `${actionType}_SUCCESS`:
        return {
          ...prevState,
          loading: false,
          data: payload,
        }
      case `${actionType}_LOADING`:
        return {
          ...prevState,
          loading: true,
          error: null,
        }
      case `${actionType}_FAILURE`:
        return {
          ...prevState,
          loading: false,
          error,
        }
      case `${actionType}_UNLOAD`:
        return defaultState
      default:
        return prevState
    }
  }

  return reducer
}

export default makeFacets
