import { createSelector } from 'reselect'
import { sortBy } from 'lodash'

const getRawHomeDocs = createSelector(
  state => state.homeDocs.ids,
  state => state.homeDocs.data,
  (ids, data) => ids === null
    ? null
    : ids.map(id => data[id])
)

export const getHomeDocs = createSelector(
  getRawHomeDocs,
  docs => docs === null
    ? null
    : sortBy(docs, 'data.start_date')
)
