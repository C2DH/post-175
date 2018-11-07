export const GET_TIME_SERIES = 'GET_TIME_SERIES'
export const loadTimeSeries = (params) => ({
  type: GET_TIME_SERIES,
  payload: params,
})

export const GET_TIME_SERIES_UNLOAD = 'GET_TIME_SERIES_UNLOAD'
export const unloadTimeSeries = () => ({
  type: GET_TIME_SERIES_UNLOAD,
})
