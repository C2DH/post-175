export const GET_PLACES = 'GET_PLACES'
export const GET_PLACES_UNLOAD = 'GET_PLACES_UNLOAD'

export const loadPlaces = (params = {}) => ({
  type: GET_PLACES,
  payload: { params, reset: true },
})

export const unloadPlaces = () => ({
  type: GET_PLACES_UNLOAD,
})
