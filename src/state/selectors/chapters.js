import { createSelector } from 'reselect'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getChapters = createSelector(
  state => state.chapters.data,
  getSelectedLangCode,
  (chapters, langCode) => {
    if (chapters === null) {
      return null
    }
    return translateDoc(chapters, langCode)
  }
)
