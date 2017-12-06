export const MAP_TIMELINE_SET_DATE = 'MAP_TIMELINE_SET_DATE'
export const setDateTimelineMap = (date) => ({
  type: MAP_TIMELINE_SET_DATE,
  payload: date.toString(),
})

export const MAP_UNLOAD = 'MAP_UNLOAD'
export const unloadMap = () => ({
  type: MAP_UNLOAD,
})

export const MAP_SET_OVER_PLACE = 'MAP_SET_OVER_PLACE'
export const setOverPlace = place => ({
  type: MAP_SET_OVER_PLACE,
  payload: place,
})

export const MAP_CLEAR_OVER_PLACE = 'MAP_CLEAR_OVER_PLACE'
export const clearOverPlace = () => ({
  type: MAP_CLEAR_OVER_PLACE,
})

export const MAP_SET_SELECTED_PLACE = 'MAP_SET_SELECTED_PLACE'
export const setSelectedPlace = place => ({
  type: MAP_SET_SELECTED_PLACE,
  payload: place,
})

export const MAP_CLEAR_SELECTED_PLACE = 'MAP_CLEAR_SELECTED_PLACE'
export const clearSelectedPlace = () => ({
  type: MAP_CLEAR_SELECTED_PLACE,
})
