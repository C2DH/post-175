import qs from 'query-string';
import { get, isNil, isEmpty } from 'lodash';
import { EVENT_COLORS } from './consts';

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
  const categoriesQs = qs.parse(location.search).categories || ''
  return categoriesQs
    .split(',')
    .filter(cat => typeof EVENT_COLORS[cat] !== 'undefined')
}

export const getQsSafeMilestone = location => {
  return +get(qs.parse(location.search), 'milestone', 1) ? true : false
}

export const makeUrlWithYear = (location, year) => {
  const qsAsObject = qs.parse(location.search)
  const newQs = qs.stringify({
    ...qsAsObject,
    year
  })
  return `${location.pathname}?${newQs}`
}

export const makeUrlWithYearAndFilters = (location, year, categories = [], milestone) => {
  const qsAsObject = qs.parse(location.search)
  const newQs = qs.stringify({
    ...qsAsObject,
    year,
    milestone: milestone ? 1 : 0,
    categories: categories.join(','),
  }, {
    encode: false,
  })
  return `${location.pathname}?${newQs}`
}

//  Set one year cookie
export const setCookie = (cookies, name, value) => {
  cookies.set(name, value, {
    path: '/',
    expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
    sameSite: 'Lax'
  });
}

export const getBooleanCookie = (cookies, name, defaultValue = false) => {

  const value = cookies.get(name);
  
  if(isNil(value) || isEmpty(value))
    return defaultValue;
  else
    return value === 'true'
}
