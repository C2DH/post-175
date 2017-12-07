import { fork, put, call } from 'redux-saga/effects'
import makeDocumentsListSaga from './hos/documents'
import { takeLatestAndCancel } from './effects/take'
import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  SELECT_EVENT,
  CLEAR_SELECTED_EVENT,
  GET_EVENT_LOADING,
  GET_EVENT_FAILURE,
  GET_EVENT_SUCCESS,
} from '../actions'
import * as api from '../../api'

function *handleLoadSelectEventDetail({ payload }) {
  const { id } = payload
  yield put({ type: GET_EVENT_LOADING })
  try {
    const eventDetail = yield call(api.getEvent, id)
    yield put({ type: GET_EVENT_SUCCESS, payload: eventDetail })
  } catch (error) {
    yield put({ type: GET_EVENT_FAILURE, error })
  }
}

export default function* rootSaga() {
  yield fork(
    takeLatestAndCancel,
    SELECT_EVENT,
    CLEAR_SELECTED_EVENT,
    handleLoadSelectEventDetail,
  )
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
