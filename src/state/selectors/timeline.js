import { createSelector } from 'reselect'
import { range, groupBy, get, sortBy, countBy, uniqueId, sum } from 'lodash'
import { getSelectedLangCode } from './lang'
import { extent } from 'd3-array'
import { scaleTime } from 'd3-scale'
import { translateDoc } from './common'

export const WIDTH_WITH_EVENTS = 300
export const WIDTH_NO_EVENTS = 100
const DAY_DURATION = 86400000

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

export const getEventsCateogryCounts = createSelector(
  getEvents,
  events => {
    if (events === null) {
      return null
    }
    return countBy(events, 'data.category')
  }
)

export const getFilteredEvents = createSelector(
  getEvents,
  state => state.timeline.categories,
  state => state.timeline.milestone,
  (events, categories, milestone) => events === null ? null : events
    .filter(event => (
      categories.indexOf(event.data.category) !== -1 &&
      (!!event.data.key_event) === milestone
    ))
)

// FIXME: Move in another magic place...
export const EVENT_NO_IMAGE_HEIGHT = 100
const EVENT_WIDTH = 150

const getImageEventHeight = (event, width) => {
  const snapshot = get(event, "documents[0].data.resolutions.low.url")
  if (snapshot) {
    const thumbnailHeight = get(event, "documents[0].data.resolutions.low.height", 0)
    const thumbnailWidth = get(event, "documents[0].data.resolutions.low.width", 0)
    return ((thumbnailHeight * width) / thumbnailWidth)
  }
  return 0
}

export const getAnnotatedEvents = createSelector(
  getFilteredEvents,
  events => {
    if (events == null ) { return null }
    let sortedEvents = sortBy(events.map(e => ({ ...e })), 'startDate')
    sortedEvents.forEach((event, i) => {
      if (i > 0) {
        if (event.startDate.getTime() - sortedEvents[i-1].startDate.getTime() < (DAY_DURATION * 180)) {
          if (!sortedEvents[i-1].displacementIndex) {
            sortedEvents[i-1].displacementIndex = 1
            sortedEvents[i-1].displacementId = uniqueId()
          }
          event.displacementIndex = sortedEvents[i-1].displacementIndex + 1
          event.displacementId = sortedEvents[i-1].displacementId
        }
      }
      event.imageHeight = getImageEventHeight(event, EVENT_WIDTH)
      event.desumedHeight = event.imageHeight + EVENT_NO_IMAGE_HEIGHT
    })
    const byDisplacementId = groupBy(sortedEvents, 'displacementId')

    return sortedEvents.map(event => {
      if (event.displacementId) {
        event.occupedHeights = byDisplacementId[event.displacementId].map(e => e.desumedHeight)
        event.totalOccupedHeight = sum(event.occupedHeights)
        event.displacementCount = 1
        event.displacementCount = byDisplacementId[event.displacementId].length
        return event
      } else {
        event.displacementId = uniqueId()
        event.occupedHeights = [event.desumedHeight]
        event.totalOccupedHeight = event.desumedHeight
        event.displacementIndex = 1
        event.displacementCount = 1
      }
      return event
    })
  }
)


export const getRawPeriods = createSelector(
  state => state.periods.ids,
  state => state.periods.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)

export const getPeriods = createSelector(
  getRawPeriods,
  periods => periods === null ? null : periods
  .map(period => ({
    ...period,
    startDate: period.data.start_date === null ? null : new Date(period.data.start_date),
    endDate: period.data.end_date === null ? null : new Date(period.data.end_date),
  }))
  .filter(p =>
    p.startDate !== null && p.endDate !== null &&
    !isNaN(p.startDate.getFullYear()) && !isNaN(p.endDate.getFullYear())
  )
  .sort((a, b) => a.startDate - b.endDate)
)

export const getEventsExtent = createSelector(
  getEvents,
  events => {
    if (events === null) {
      return null
    }
    const eventsExtent = extent(events, e => e.startDate)
    return eventsExtent
  }
)

export const getPeriodsExtent = createSelector(
  getPeriods,
  periods => {
    if (periods === null) {
      return null
    }
    return [periods[0].startDate, periods[periods.length - 1].endDate]
  }
)

export const getTimelineCurrentDate = createSelector(
  getEventsExtent,
  state => state.timeline.currentDate,
  (extent, date) => {
    if (extent === null) {
      return null
    }
    if (date === null) {
      // return new Date(1924,0,1)
      return extent[0]
    }
    return new Date(date)
  }
)

export const getTimelineYearsWithEvents = createSelector(
  getEventsExtent,
  getAnnotatedEvents,
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

    return scaleTime().domain(domain).range(scaleRange)
  }
)

export const getTimelineCurrentPeriod = createSelector(
  getPeriods,
  getTimelineCurrentDate,
  (periods, currentDate) => {
    if (periods === null || currentDate === null) {
      return null
    }
    for (let i = 0; i < periods.length; i++) {
      const period = periods[i]
      if (currentDate >= period.startDate && currentDate <= period.endDate) {
        return period
      }
    }
    return null
  }
)

export const getTimelinePrevPeriod = createSelector(
  getPeriods,
  getTimelineCurrentPeriod,
  (periods, period) => {
    if (period === null) {
      return null
    }
    const index = periods.indexOf(period)
    if (index > 0) {
      return periods[index - 1]
    }
    return null
  }
)

export const getTimelineNextPeriod = createSelector(
  getPeriods,
  getTimelineCurrentPeriod,
  (periods, period) => {
    if (period === null) {
      return null
    }
    const index = periods.indexOf(period)
    if (index < periods.length - 1) {
      return periods[index + 1]
    }
    return null
  }
)

export const getSelectedEvent = state => state.selectedEvent

export const getTimelinePrevEvent = createSelector(
  getSelectedEvent,
  getAnnotatedEvents,
  (event, events) => {
    if (event === null || events === null) {
      return null
    }
    const index = events.indexOf(event)
    if (index > 0) {
      return events[index - 1]
    }
    return null
  }
)

export const getTimelineNextEvent = createSelector(
  getSelectedEvent,
  getAnnotatedEvents,
  (event, events) => {
    if (event === null || events === null) {
      return null
    }
    const index = events.indexOf(event)
    if (index < events.length - 1) {
      return events[index + 1]
    }
    return null
  }
)
