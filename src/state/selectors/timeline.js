import { createSelector } from 'reselect'
import { range, groupBy, last } from 'lodash'
import { getSelectedLangCode } from './lang'
import { extent } from 'd3-array'
import { scaleTime } from 'd3-scale'
import { translateDoc } from './common'

export const WIDTH_WITH_EVENTS = 300
export const WIDTH_NO_EVENTS = 100

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
      // return new Date(1924,0,1)
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