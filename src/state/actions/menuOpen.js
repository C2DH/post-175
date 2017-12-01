export const SET_MENU_OPEN = 'SET_MENU_OPEN'

export const setMenuOpen = open => ({
  type: SET_MENU_OPEN,
  paylad: open,
})

export const openMenu = () => setMenuOpen(true)
export const closeMenu = () => setMenuOpen(false)

export const TOGGLE_MENU_OPEN = 'TOGGLE_MENU_OPEN'

export const toggleMenuOpen = () => ({
  type: TOGGLE_MENU_OPEN,
})
