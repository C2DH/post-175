import { fork, put, call, select, takeEvery } from 'redux-saga/effects'
import { setLanguage } from 'redux-i18n'
import { takeLatestAndCancel } from './effects/take'
import makeDocumentsListSaga from './hos/documents'
import makeFacetsSaga from './hos/facets'
import {
  GET_EVENTS,
  GET_PERIODS,
  GET_PLACES,
  GET_HOME_DOCS,
  GET_COLLECTION_DOCS,
  GET_COLLECTION_FACETS,
  GET_STORY,
  GET_STORY_SUCCESS,
  GET_STORY_LOADING,
  GET_STORY_FAILURE,
  GET_STORY_UNLOAD,
  SET_SELECTED_LANG,
  SEARCH_SUGGESTION,
  CLEAR_SEARCH_SUGGESTION,
  GET_DOCUMENT,
  GET_DOCUMENT_UNLOAD,
  GET_TIME_SERIES,
  GET_TIME_SERIES_UNLOAD,
  GET_RASTER_LAYERS,
} from '../actions'
import {
  getSelectedLang,
} from '../selectors'
import * as api from '../../api'

function *handleGetStory({ payload }) {
  yield put({ type: GET_STORY_LOADING })
  try {
    // HACK used to provide the fake story!
    let story
    if (payload === 'video_fake_story') {
      story = yield call(api.getFakeStory, payload)
    } else {
      story = yield call(api.getStory, payload)
    }
    yield put({ type: GET_STORY_SUCCESS, payload: story })
  } catch (error) {
    yield put({ type: GET_STORY_FAILURE, error })
  }
}

function *handleGetDocument({ payload }) {
  yield put({ type: `${GET_DOCUMENT}_LOADING` })
  try {
    const story = yield call(api.getDocument, payload)
    yield put({ type: `${GET_DOCUMENT}_SUCCESS`, payload: story })
  } catch (error) {
    yield put({ type: `${GET_DOCUMENT}_FAILURE`, error })
  }
}

function *handleGetTimeSeries({ payload }) {
  yield put({ type: `${GET_TIME_SERIES}_LOADING` })
  try {
    const series = yield call(api.getTimeSeries, payload)
    yield put({ type: `${GET_TIME_SERIES}_SUCCESS`, payload: series })
  } catch (error) {
    yield put({ type: `${GET_TIME_SERIES}_FAILURE`, error })
  }
}

function *handleSearchSuggestion({ payload }) {
  yield put({ type: `${SEARCH_SUGGESTION}_LOADING` })
  try {
    const results = yield call(api.searchSuggestion, payload)
    yield put({ type: `${SEARCH_SUGGESTION}_SUCCESS`, payload: results })
  } catch (error) {
    yield put({ type: `${SEARCH_SUGGESTION}_FAILURE`, error })
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
    GET_TIME_SERIES,
    GET_TIME_SERIES_UNLOAD,
    handleGetTimeSeries,
  )
  yield fork(
    takeLatestAndCancel,
    GET_STORY,
    GET_STORY_UNLOAD,
    handleGetStory,
  )
  yield fork(
    takeLatestAndCancel,
    GET_DOCUMENT,
    GET_DOCUMENT_UNLOAD,
    handleGetDocument,
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
  yield fork(makeFacetsSaga(
    GET_COLLECTION_FACETS,
    api.getCollectionDocuments,
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
  yield fork(
    takeLatestAndCancel,
    SEARCH_SUGGESTION,
    CLEAR_SEARCH_SUGGESTION,
    handleSearchSuggestion,
  )
  yield fork(makeDocumentsListSaga(
    GET_RASTER_LAYERS,
    api.getRasterLayers,
    state => state.rasterLayers,
  ))
}
