export const GET_EVENTS = 'GET_EVENTS'
export const GET_EVENTS_UNLOAD = 'GET_EVENTS_UNLOAD'

export const loadEvents = (params = {}) => ({
  type: GET_EVENTS,
  payload: { params, reset: true },
})

export const unloadEvents = () => ({
  type: GET_EVENTS_UNLOAD,
})

export const GET_PERIODS = 'GET_PERIODS'
export const GET_PERIODS_UNLOAD = 'GET_PERIODS_UNLOAD'

export const loadPeriods = (params = {}) => ({
  type: GET_PERIODS,
  payload: { params, reset: true },
})

export const unloadPeriods = () => ({
  type: GET_PERIODS_UNLOAD,
})

export const SELECT_EVENT = 'SELECT_EVENT'
export const selectEvent = event => ({
  type: SELECT_EVENT,
  payload: event,
})

export const CLEAR_SELECTED_EVENT = 'CLEAR_SELECTED_EVENT'
export const clearSelectedEvent = () => ({
  type: CLEAR_SELECTED_EVENT,
})

export const GET_EVENT_LOADING = 'GET_EVENT_LOADING'
export const GET_EVENT_FAILURE = 'GET_EVENT_FAILURE'
export const GET_EVENT_SUCCESS = 'GET_EVENT_SUCCESS'
