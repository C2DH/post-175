import { put, fork, call } from 'redux-saga/effects'
import { takeLatestAndCancel } from '../effects/take'

// Make a saga for facets
const makeFacets = (
  actionType,
  apiFn,
) => {
  function* handleGetFacets({ payload: { params } }) {
    yield put({ type: `${actionType}_LOADING` })
    try {
      const { facets, count } = yield call(apiFn, {
        ...params,
        facets_only: true,
        limit: 1,
      })

      yield put({
        type: `${actionType}_SUCCESS`,
        payload: { facets, count },
      })
    } catch (error) {
      yield put({ type: `${actionType}_FAILURE`, error: String(error) })
    }
  }

  return function* watchFacets() {
    yield fork(
      takeLatestAndCancel,
      actionType,
      `${actionType}_UNLOAD`,
      handleGetFacets
    )
  }
}

export default makeFacets
