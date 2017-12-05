import { createSelector } from 'reselect'
import { range, groupBy, mapValues, isPlainObject, last } from 'lodash'
import { getSelectedLangCode } from './lang'
import { extent } from 'd3-array'
import { scaleTime } from 'd3-scale'

export const WIDTH_WITH_EVENTS = 300
export const WIDTH_NO_EVENTS = 100

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
    if (extent === null) {
      return null
    }
    if (date === null) {
      return new Date(1924,0,1)
      return extent[0]
    }
    return new Date(date)
  }
)

export const getTimelineYearsWithEvents = createSelector(
  getEventsExtent,
  getEvents,
  (extent, events) => {
    if (extent === null) {
      return null
    }

    const yearsRange = range(extent[0].getFullYear(), extent[1].getFullYear()+1)
    const eventsByYear = groupBy(events, e => e.startDate.getFullYear())

    return yearsRange.map(year => ({
      year,
      date: new Date(year, 0, 1),
      hasEvents: !!eventsByYear[year],
      events: eventsByYear[year] || [],
    }))
  }
)

export const getTimelineTopScale = createSelector(
  getEventsExtent,
  getTimelineYearsWithEvents,
  (extent, years) => {
    const scaleRange = [0]
    const maxYear = Math.round((extent[1].getFullYear()+1) / 10) * 10

    let domain = years.map(year => year.date)
    years.forEach((year, i) => {
      if(i < years.length - 1){
        const delta = years[i].hasEvents ? WIDTH_WITH_EVENTS : WIDTH_NO_EVENTS
        scaleRange.push(delta + scaleRange[i])
      }
    })

    // const lastRange = last(scaleRange)
    //
    // range(last(years+1), maxYear+1).forEach(year => {
    //   domain.push(year)
    //   scaleRange.push(lastRange)
    // })

    console.log("d", domain, scaleRange)

    return scaleTime().domain(domain).range(scaleRange)
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
