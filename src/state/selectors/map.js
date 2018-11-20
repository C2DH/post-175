import { createSelector } from 'reselect'
import { extent } from 'd3-array'
import { get, flatten, countBy } from 'lodash'
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

const mapPlace = place => ({
  ...place,
  startDate: place.data.start_date === null ? null : new Date(place.data.start_date),
  endDate: place.data.end_date === null ? null : new Date(place.data.end_date),
  coordinates: get(place, 'data.coordinates.geometry.coordinates', [])
    .slice(0, 2).map(x => +x).reverse(),
})

export const getPlaces = createSelector(
  getRawPlaces,
  places => places === null ? null : places.map(mapPlace)
)

export const getPlaceTypesCount = createSelector(
  getPlaces,
  places => {
    if (places === null) {
      return {}
    }
    return countBy(places, 'data.place_type')
  }
)

export const getPlacesRealExtent = createSelector(
  getPlaces,
  places => places === null
    ? null
    : extent(flatten(places.map(p => [p.startDate, p.endDate])))
)

//
export const getPlacesExtent = createSelector(
  getPlacesRealExtent,
  extent => extent === null ? null : [extent[0], new Date(`${extent[1].getFullYear()}`)]
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

export const getMapOverPlace = createSelector(
  getMapTimelineCurrentDate,
  state => state.map.overPlace,
  state => state.places.data,
  getSelectedLangCode,
  (currentDate, id, data, langCode) => {
    if (id === null) {
      return null
    }
    const place =  mapPlace(translateDoc(data[id], langCode))
    return {
      ...place,
      open: place.endDate === null || place.endDate > currentDate,
    }

  }
)

export const getMapSelectedPlace = createSelector(
  state => state.map.selectedPlace,
  state => state.places.data,
  getSelectedLangCode,
  (id, data, langCode) => {
    if (id === null) {
      return null
    }
    return mapPlace(translateDoc(data[id], langCode))
  }
)
