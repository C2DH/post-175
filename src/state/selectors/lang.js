import { createSelector } from 'reselect'
import qs from 'query-string'
import { find } from 'lodash'

export const getLangs = state => state.lang.list

export const getSelectedLangCode = state => state.lang.selected

export const getSelectedLang = createSelector(
  getLangs,
  getSelectedLangCode,
  (langs, code) => find(langs, { code })
)

export const getMakeLangUrl = createSelector(
  getSelectedLang,
  currentLang => (url = '', lang) => {
    const newLangParam = typeof lang === 'undefined' ? currentLang.param : lang
    const qsAsObject = qs.parse(qs.extract(url))
    const newQs = qs.stringify({ ...qsAsObject, lang: newLangParam })
    return url.split('?')[0] + '?' + newQs
  }
)
