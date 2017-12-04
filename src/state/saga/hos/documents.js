import { put, select, fork, call } from 'redux-saga/effects'
import { identity } from 'lodash'
import qs from 'query-string'
import { takeLatestAndCancel } from '../effects/take'

export const DEFAULT_PAGE_SIZE = 1000

// Make a saga for documents list
const makeDocumentsList = (
  actionType,
  apiFn,
  selectState,
  pageSize = DEFAULT_PAGE_SIZE,
  transform = identity,
) => {
  function* handleGetDocumentsList({ payload: { params, reset } }) {
    yield put({ type: `${actionType}_LOADING` })
    try {
      const offset = reset
        ? 0
        : yield select(state => selectState(state).pagination.offset)

      const { results, next, count, facets } = yield call(apiFn, {
        ...params,
        limit: pageSize,
        offset,
      })

      const nextOffset = next ? +qs.parse(qs.extract(next)).offset : null
      yield put({
        type: `${actionType}_SUCCESS`,
        payload: {
          results: transform(results),
          offset: nextOffset,
          count,
          reset,
          facets,
        },
      })
    } catch (error) {
      yield put({ type: `${actionType}_FAILURE`, error: String(error) })
    }
  }

  return function* watchGetDocumentsList() {
    yield fork(
      takeLatestAndCancel,
      actionType,
      `${actionType}_UNLOAD`,
      handleGetDocumentsList
    )
  }
}

export default makeDocumentsList
