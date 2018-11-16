import { combineReducers } from 'redux'
import { i18nState } from 'redux-i18n'
import menuOpen from './menuOpen'
import lang from './lang'
import makeDocumentsList from './hor/documents'
import makeFacets from './hor/facets'
import timeline from './timeline'
import selectedEvent from './selectedEvent'
import map from './map'
import storyDetail from './storyDetail'
import searchSuggestion from './searchSuggestion'
import docDetail from './docDetail'
import timeSeries from './timeSeries'

import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  GET_HOME_DOCS,
  GET_COLLECTION_DOCS,
  GET_COLLECTION_FACETS,
  GET_RASTER_LAYERS,
} from '../actions'

export default combineReducers({
  i18nState,
  menuOpen,
  lang,
  timeline,
  map,
  timeSeries,
  selectedEvent,
  storyDetail,
  searchSuggestion,
  docDetail,
  events: makeDocumentsList(GET_EVENTS),
  periods: makeDocumentsList(GET_PERIODS),
  places: makeDocumentsList(GET_PLACES),
  homeDocs: makeDocumentsList(GET_HOME_DOCS),
  collectionDocs: makeDocumentsList(GET_COLLECTION_DOCS),
  collectionFacets: makeFacets(GET_COLLECTION_FACETS),
  rasterLayers: makeDocumentsList(GET_RASTER_LAYERS),
})
