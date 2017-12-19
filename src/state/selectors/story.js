import { createSelector } from 'reselect'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getStory = createSelector(
  state => state.storyDetail.data,
  getSelectedLangCode,
  (story, langCode) => story === null ? null : translateDoc(story, langCode)
)
