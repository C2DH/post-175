import { EVENT_COLORS } from './consts'

export const getEventColor = event => {
  const color = EVENT_COLORS[event.data.category]
  if (typeof color === 'undefined') {
    console.info(`Invalid color for category ${event.data.category}`)
    return 'white'
  }
  return color
}
