import { createSelector } from 'reselect'
import { find } from 'lodash'

export const getLangs = state => state.lang.list

const getSelectedLangCode = state => state.lang.selected

export const getSelectedLang = createSelector(
  getLangs,
  getSelectedLangCode,
  (langs, code) => find(langs, { code })
)

export const getMakeLangUrl = createSelector(
  getSelectedLang,
  getSelectedLang => (url = '') => `/${getSelectedLang.param}${url}`
)
