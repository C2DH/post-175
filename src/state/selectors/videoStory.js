import { createSelector } from 'reselect'
import get from 'lodash/get'
import find from 'lodash/find'
import keyBy from 'lodash/keyBy'
import { getSelectedLangCode } from './lang'
import { translateDoc } from './common'

export const getVideoStory = createSelector(
  state => state.storyDetail.data,
  getSelectedLangCode,
  (story, langCode) => {
    if (story === null) {
      return null
    }
    return story
  }
)

export const getVideoUrl = createSelector(
  getVideoStory,
  story => {
    if (story === null) {
      return null
    }
    const objectId = get(story, 'contents.modules[0].object.id')
    if (objectId) {
      const doc = find(story.documents, { id: objectId })
      if (doc) {
        return doc.url
      }
    }
    return null
  }
)

export const getSpeakers = createSelector(
  getVideoStory,
  story => {
    if (story === null) {
      return null
    }
    const speakers = get(story, 'contents.modules[0].speakers')
    console.log('~~', speakers)
    const docsBy = keyBy(story.documents, 'id')
    if (Array.isArray(speakers)) {
      return speakers.map(speaker => ({
        from: speaker.from,
        to: speaker.to,
        doc: docsBy[speaker.id],
      }))
    }
    return null
  }
)

export const getSideDocs = createSelector(
  getVideoStory,
  story => {
    if (story === null) {
      return null
    }
    const speakers = get(story, 'contents.modules[0].objects')
    const docsBy = keyBy(story.documents, 'id')
    if (Array.isArray(speakers)) {
      return speakers.map(speaker => ({
        from: speaker.from,
        to: speaker.to,
        doc: docsBy[speaker.id],
      }))
    }
    return null
  }
)
