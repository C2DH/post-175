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

export const getDocuments = (params = {}) =>
  request.get(`${API_URL}/document/`)
    .query(buildMillerParams(params))
    .then(extractBody)

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
  },
})
