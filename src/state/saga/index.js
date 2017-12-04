import { fork } from 'redux-saga/effects'
import makeDocumentsListSaga from './hos/documents'
import {
  GET_EVENTS,
  GET_PERIODS,
} from '../actions'
import * as api from '../../api'

export default function* rootSaga() {
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
}
