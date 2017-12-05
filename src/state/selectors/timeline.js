import { createSelector } from 'reselect'
import { mapValues, isPlainObject } from 'lodash'
import { getSelectedLangCode } from './lang'
import { extent } from 'd3-array'

// TODO: Move in such as common
const translateDoc = (doc, langCode) => {
  const transObj = (obj, key, sourceObj) => {
    if (isPlainObject(obj)) {
      if (typeof obj[langCode] !== 'undefined') {
        return obj[langCode]
      }
      return mapValues(obj, transObj)
    }
    return obj
  }

  return mapValues(doc, transObj)
}

export const getRawEvents = createSelector(
  state => state.events.ids,
  state => state.events.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)

export const getEvents = createSelector(
  getRawEvents,
  events => events === null ? null : events.map(event => ({
    ...event,
    startDate: event.data.start_date === null ? null : new Date(event.data.start_date),
    endDate: event.data.end_date === null ? null : new Date(event.data.end_date),
  }))
)

export const getEventsExtent = createSelector(
  getEvents,
  events => events === null ? null : extent(events, e => e.startDate)
)

export const getTimelineCurrentDate = createSelector(
  getEventsExtent,
  state => state.timeline.currentDate,
  (extent, date) => {
    console.log("11", extent,date)
    if (extent === null) {
      return null
    }
    if (date === null) {
      return extent[0]
    }
    return new Date(date)
  }
)

export const getPeriods = createSelector(
  state => state.periods.ids,
  state => state.periods.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)
