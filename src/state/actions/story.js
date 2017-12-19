export const GET_STORY = 'GET_STORY'
export const GET_STORY_SUCCESS = 'GET_STORY_SUCCESS'
export const GET_STORY_LOADING = 'GET_STORY_LOADING'
export const GET_STORY_FAILURE = 'GET_STORY_FAILURE'
export const GET_STORY_UNLOAD = 'GET_STORY_UNLOAD'

export const loadStory = (idOrSlug) => ({
  type: GET_STORY,
  payload: idOrSlug,
})

export const unloadStory = () => ({
  type: GET_STORY_UNLOAD,
})
