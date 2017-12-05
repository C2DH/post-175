export const TIMELINE_SET_DATE = 'TIMELINE_SET_DATE'
export const TIMELINE_UNLOAD = 'TIMELINE_UNLOAD'

export const setDateTimeline = (date) => ({
  type: TIMELINE_SET_DATE,
  payload: date.toString(),
})

export const unloadTimeline = () => ({
  type: TIMELINE_UNLOAD,
})
