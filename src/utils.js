import qs from 'query-string'
import { EVENT_COLORS } from './consts'

export const getEventColor = event => {
  const color = EVENT_COLORS[event.data.category]
  if (typeof color === 'undefined') {
    // console.info(`Invalid color for category ${event.data.category}`, event)
    return 'white'
  }
  return color
}

export const getQsSafeYear = location => {
  const yearQs = qs.parse(location.search)['year']
  return Math.abs(parseInt(yearQs, 10))
}

export const getQsSafeCategories = location => {
  const categoriesQs = qs.parse(location.search).categories || []
  return categoriesQs
    .split(',')
    .filter(cat => typeof EVENT_COLORS[cat] !== 'undefined')
}

export const makeUrlWithYear = (location, year) => {
  const qsAsObject = qs.parse(location.search)
  const newQs = qs.stringify({
    ...qsAsObject,
    year
  })
  return `${location.pathname}?${newQs}`
}

export const makeUrlWithYearAndCategories = (location, year, categories = []) => {
  const qsAsObject = qs.parse(location.search)
  const newQs = qs.stringify({
    ...qsAsObject,
    year,
    categories: categories.join(','),
  }, {
    encode: false,
  })
  return `${location.pathname}?${newQs}`
}
