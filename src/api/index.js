// API CALLS
import request from 'superagent'
const API_URL = '/api'

// Extract only body from response, when other stuff like response
// headers and so on are useless
const extractBody = ({ body }) => body

const buildMillerParams = (params) => {
  let newParams = params

  if (newParams.filters && typeof newParams.filters !== 'string') {
    newParams = { ...newParams, filters: JSON.stringify(newParams.filters) }
  }

  if (newParams.exclude && typeof newParams.exclude !== 'string') {
    newParams = { ...newParams, exclude: JSON.stringify(newParams.exclude) }
  }

  return newParams
}

export const getStory = (idOrSlug) =>
  request.get(`${API_URL}/story/${idOrSlug}/`)
    .then(extractBody)

export const getDocuments = (params = {}) =>
  request.get(`${API_URL}/document/`)
    .query(buildMillerParams(params))
    .then(extractBody)

export const getEvent = (id) =>
  request.get(`${API_URL}/document/${id}`)
    .then(extractBody)

export const getHomeDocuments = (params = {}) => getDocuments({
  ...params,
  filters: {
    ...params.filters,
    data__type: 'home',
  },
})

export const getCollectionDocuments = (params = {}) => getDocuments({
  ...params,
  filters: {
    ...params.filters,
    data__type__in: [
      'law', 'office', 'portrait', 'product', 'service',
      'technology', 'transport',
    ],
  },
})

export const getEvents = (params = {}) => getDocuments({
  ...params,
  filters: {
    ...params.filters,
    data__type: 'event',
  },
})

export const getPeriods = (params = {}) => getDocuments({
  ...params,
  filters: {
    ...params.filters,
    data__type: 'period',
    type: 'entity',
  },
})

export const getPlaces = (params = {}) => getDocuments({
  ...params,
  filters: {
    ...params.filters,
    data__type: 'place',
  },
})
