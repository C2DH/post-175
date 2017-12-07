import { combineReducers } from 'redux'
import menuOpen from './menuOpen'
import lang from './lang'
import makeDocumentsList from './hor/documents'
import timeline from './timeline'
import selectedEvent from './selectedEvent'
import map from './map'

import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
} from '../actions'

export default combineReducers({
  menuOpen,
  lang,
  timeline,
  map,
  selectedEvent,
  events: makeDocumentsList(GET_EVENTS),
  periods: makeDocumentsList(GET_PERIODS),
  places: makeDocumentsList(GET_PLACES),
})
