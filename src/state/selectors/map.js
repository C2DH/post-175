import { createSelector } from 'reselect'
import { extent } from 'd3-array'
import { get } from 'lodash'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getRawPlaces = createSelector(
  state => state.places.ids,
  state => state.places.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)

export const getPlaces = createSelector(
  getRawPlaces,
  places => places === null ? null : places.map(place => ({
    ...place,
    startDate: place.data.start_date === null ? null : new Date(place.data.start_date),
    endDate: place.data.end_date === null ? null : new Date(place.data.end_date),
    coordinates: get(place, 'data.coordinates.geometry.coordinates', [])
      .slice(0, 2).map(x => +x).reverse(),
  }))
)

export const getPlacesExtent = createSelector(
  getPlaces,
  places => places === null ? null : extent(places, p => p.startDate)
)

export const getMapTimelineCurrentDate = createSelector(
  getPlacesExtent,
  state => state.map.currentDate,
  (extent, date) => {
    if (extent === null) {
      return null
    }
    if (date === null) {
      return extent[1]
    }
    return new Date(date)
  }
)

export const getPlacesInDate = createSelector(
  getMapTimelineCurrentDate,
  getPlaces,
  (currentDate, places) => {
    if (currentDate === null || places === null) {
      return null
    }
    return places
      .filter(place => place.startDate <= currentDate)
      .map(place => ({
        ...place,
        open: place.endDate === null || place.endDate > currentDate,
      }))
  }
)

export const getMapOverPlace = state => state.map.overPlace
export const getMapSelectedPlace = state => state.map.selectedPlace
