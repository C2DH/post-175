import { combineReducers } from 'redux'
import menuOpen from './menuOpen'
import lang from './lang'
import makeDocumentsList from './hor/documents'

import {
  GET_EVENTS,
  GET_PERIODS,
} from '../actions'

export default combineReducers({
  menuOpen,
  lang,
  events: makeDocumentsList(GET_EVENTS),
  periods: makeDocumentsList(GET_PERIODS),
})
