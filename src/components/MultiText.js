import React from 'react'

export default class MultiText extends React.PureComponent {
  render() {
    const { text, x = 0, y = 0, spacing = 20, maxLen = null, numitems = 2, ...rest } = this.props
    const pieces = text.split(' ')
    const lines = pieces.reduce((acc, value, idx) => {
      if (!acc.length) {
        acc.push([value])
      } else {
        if (acc[acc.length - 1].length < numitems) {
          if (maxLen) {
            const totlen = acc[acc.length - 1].join(' ').length + value.length
            if (totlen > maxLen) {
              acc.push([value])
            } else {
              acc[acc.length - 1].push(value)
            }
          } else {
            acc[acc.length - 1].push(value)
          }
        } else {
          acc.push([value])
        }
      }
      return acc
    }, [])

    return (
      <text x={x} y={y} {...rest}>{
        lines.map((line, i) => (
          <tspan x={x} dx="0" y={y + i * spacing} key={i}>{line.join(' ')}</tspan>
        ))
      }</text>
    )
  }
}
