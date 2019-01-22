export const GET_CHAPTERS = 'GET_CHAPTERS'
export const GET_CHAPTERS_SUCCESS = 'GET_CHAPTERS_SUCCESS'
export const GET_CHAPTERS_LOADING = 'GET_CHAPTERS_LOADING'
export const GET_CHAPTERS_FAILURE = 'GET_CHAPTERS_FAILURE'
export const GET_CHAPTERS_UNLOAD = 'GET_CHAPTERS_UNLOAD'

export const loadChapters = () => ({
  type: GET_CHAPTERS,
})

export const unloadChapters = () => ({
  type: GET_CHAPTERS_UNLOAD,
})
