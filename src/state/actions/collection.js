export const GET_COLLECTION_DOCS = 'GET_COLLECTION_DOCS'
export const GET_COLLECTION_DOCS_UNLOAD = 'GET_COLLECTION_DOCS_UNLOAD'

export const loadCollectionDocuments = (params = {}) => ({
  type: GET_COLLECTION_DOCS,
  payload: { params, reset: true },
})

export const unloadCollectionDocuments = () => ({
  type: GET_COLLECTION_DOCS_UNLOAD,
})


export const GET_COLLECTION_FACETS = 'GET_COLLECTION_FACETS'
export const GET_COLLECTION_FACETS_UNLOAD = 'GET_COLLECTION_FACETS_UNLOAD'

export const loadCollectionFacets = (params = {}) => ({
  type: GET_COLLECTION_FACETS,
  payload: { params },
})

export const unloadCollectionFacets = () => ({
  type: GET_COLLECTION_FACETS_UNLOAD,
})
