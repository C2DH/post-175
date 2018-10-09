import { fork, put, call, select, takeEvery } from 'redux-saga/effects'
import { setLanguage } from 'redux-i18n'
import { takeLatestAndCancel } from './effects/take'
import makeDocumentsListSaga from './hos/documents'
import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  GET_HOME_DOCS,
  GET_COLLECTION_DOCS,
  GET_STORY,
  GET_STORY_SUCCESS,
  GET_STORY_LOADING,
  GET_STORY_FAILURE,
  GET_STORY_UNLOAD,
  SET_SELECTED_LANG,
} from '../actions'
import {
  getSelectedLang,
} from '../selectors'
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

function *syncLangWi18n() {
  const lang = yield select(getSelectedLang)
  yield put(setLanguage(lang.param))
}

export default function* rootSaga() {
  yield takeEvery(SET_SELECTED_LANG, syncLangWi18n)
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
    GET_COLLECTION_DOCS,
    api.getCollectionDocuments,
    state => state.collectionDocs,
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
