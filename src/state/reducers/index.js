import { combineReducers } from 'redux'
import menuOpen from './menuOpen'
import lang from './lang'
import makeDocumentsList from './hor/documents'
import timeline from './timeline'

import {
  GET_EVENTS,
  GET_PERIODS,
} from '../actions'

export default combineReducers({
  menuOpen,
  lang,
  timeline,
  events: makeDocumentsList(GET_EVENTS),
  periods: makeDocumentsList(GET_PERIODS),
})
