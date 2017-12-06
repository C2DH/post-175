import { uniq } from 'lodash'
import { normalizeCollection } from '../../utils'

const makeDocumentsList = (actionType) => {

  const defaultState = {
    loading: false,
    error: null,
    // null instead of [] to discriminating the inital state by the empy state
    ids: null,
    data: {},
    pagination: {
      count: null,
      offset: 0,
    },
    // Facets related to current data
    facets: {},
  }

  const reducer = (prevState = defaultState, { type, payload, error }) => {
    switch (type) {
      case `${actionType}_SUCCESS`: {
        const { reset, results, count, offset, facets } = payload
        const fresh = normalizeCollection(results, 'id')

        return {
          ...prevState,
          loading: false,
          ids: reset ? fresh.ids : uniq(prevState.ids.concat(fresh.ids)),
          data: reset ? fresh.data : { ...prevState.data, ...fresh.data },
          pagination: {
            count,
            offset,
          },
          facets: typeof facets === 'undefined' ? prevState.facets : facets,
        }
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

export default makeDocumentsList
