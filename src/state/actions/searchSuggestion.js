export const SEARCH_SUGGESTION = 'SEARCH_SUGGESTION'
export const CLEAR_SEARCH_SUGGESTION = 'CLEAR_SEARCH_SUGGESTION'

export const searchSuggestions = (term) => ({
  type: SEARCH_SUGGESTION,
  payload: term,
})

export const clearSuggestions = () => ({
  type: CLEAR_SEARCH_SUGGESTION,
})
