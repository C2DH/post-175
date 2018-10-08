export const TIMELINE_SET_DATE = 'TIMELINE_SET_DATE'
export const TIMELINE_TOGGLE_CATEGORY = 'TIMELINE_TOGGLE_CATEGORY'
export const TIMELINE_SET_CATEGORIES = 'TIMELINE_SET_CATEGORIES'
export const TIMELINE_UNLOAD = 'TIMELINE_UNLOAD'

export const setDateTimeline = (date) => ({
  type: TIMELINE_SET_DATE,
  payload: date.toString(),
})

export const toggleCategoryTimeline = (category) => ({
  type: TIMELINE_TOGGLE_CATEGORY,
  payload: category,
})

export const setCategoriesTimeline = (categories) => ({
  type: TIMELINE_SET_CATEGORIES,
  payload: categories,
})

export const unloadTimeline = () => ({
  type: TIMELINE_UNLOAD,
})
