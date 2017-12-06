export const MAP_TIMELINE_SET_DATE = 'MAP_TIMELINE_SET_DATE'
export const MAP_UNLOAD = 'MAP_UNLOAD'

export const setDateTimelineMap = (date) => ({
  type: MAP_TIMELINE_SET_DATE,
  payload: date.toString(),
})

export const unloadMap = () => ({
  type: MAP_UNLOAD,
})
