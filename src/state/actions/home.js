export const GET_HOME_DOCS = 'GET_HOME_DOCS'
export const GET_HOME_DOCS_UNLOAD = 'GET_HOME_DOCS_UNLOAD'

export const loadHomeDocs = (params = {}) => ({
  type: GET_HOME_DOCS,
  payload: { params, reset: true },
})

export const unloadHomeDocs = () => ({
  type: GET_HOME_DOCS_UNLOAD,
})
