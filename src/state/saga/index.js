import { fork, put, call } from 'redux-saga/effects'
import { takeLatestAndCancel } from './effects/take'
import makeDocumentsListSaga from './hos/documents'
import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  GET_HOME_DOCS,
  GET_STORY,
  GET_STORY_SUCCESS,
  GET_STORY_LOADING,
  GET_STORY_FAILURE,
  GET_STORY_UNLOAD,
} from '../actions'
import * as api from '../../api'

function *handleGetStory({ payload }) {
  yield put({ type: GET_STORY_LOADING })
  try {
    const story = yield call(api.getStory, payload)
    yield put({ type: GET_STORY_SUCCESS, payload: story })
  } catch (error) {
    yield put({ type: GET_STORY_FAILURE, error })
  }
}

export default function* rootSaga() {
  yield fork(
    takeLatestAndCancel,
    GET_STORY,
    GET_STORY_UNLOAD,
    handleGetStory,
  )
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
