import { createSelector } from 'reselect'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getCollectionDocuments = createSelector(
  state => state.collectionDocs.ids,
  state => state.collectionDocs.data,
  getSelectedLangCode,
  (ids, data, langCode) => ids === null
    ? null
    : ids.map(id => translateDoc(data[id], langCode))
)
