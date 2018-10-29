export const GET_DOCUMENT = 'GET_DOCUMENT'
export const loadDocument = id => ({
  type: GET_DOCUMENT,
  payload: id,
})

export const GET_DOCUMENT_UNLOAD = 'GET_DOCUMENT_UNLOAD'
export const unloadDocument = () => ({
  type: GET_DOCUMENT_UNLOAD,
})
