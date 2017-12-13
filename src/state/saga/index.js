import { fork } from 'redux-saga/effects'
import makeDocumentsListSaga from './hos/documents'
import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  GET_HOME_DOCS,
} from '../actions'
import * as api from '../../api'

export default function* rootSaga() {
  yield fork(makeDocumentsListSaga(
    GET_HOME_DOCS,
    api.getHomeDocuments,
    state => state.homeDocs,
    50, // <--- Count of home images!
  ))
  yield fork(makeDocumentsListSaga(
    GET_EVENTS,
    api.getEvents,
    state => state.events,
  ))
  yield fork(makeDocumentsListSaga(
    GET_PERIODS,
    api.getPeriods,
    state => state.periods,
  ))
  yield fork(makeDocumentsListSaga(
    GET_PLACES,
    api.getPlaces,
    state => state.periods,
  ))
}
