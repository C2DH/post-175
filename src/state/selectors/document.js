import { createSelector } from 'reselect'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getDocDetail = createSelector(
  state => state.docDetail.data,
  getSelectedLangCode,
  (doc, langCode) => {
    if (!doc) {
      return doc
    }
    return translateDoc(doc, langCode)
  }
)
