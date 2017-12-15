import { createSelector } from 'reselect'
import { translateDoc } from './common'
import { getSelectedLangCode } from './lang'
import { sortBy } from 'lodash'

const getRawHomeDocs = createSelector(
  state => state.homeDocs.ids,
  state => state.homeDocs.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : translateDoc(ids.map(id => data[id]), langCode)
)

export const getHomeDocs = createSelector(
  getRawHomeDocs,
  docs => docs === null
    ? null
    : sortBy(docs, 'data.start_date')
)
