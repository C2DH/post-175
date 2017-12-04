export const GET_EVENTS = 'GET_EVENTS'
export const GET_EVENTS_UNLOAD = 'GET_EVENTS_UNLOAD'

export const loadEvents = (params = {}) => ({
  type: GET_EVENTS,
  payload: { params, reset: true },
})

export const unloadEvents = () => ({
  type: GET_EVENTS_UNLOAD,
})
