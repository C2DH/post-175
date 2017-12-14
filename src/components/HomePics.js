import React from 'react'
import ReactDOM from 'react-dom'
import { range, sumBy, sum, max } from 'lodash'
import { StaggeredMotion, Motion, spring } from 'react-motion'
import { scaleLinear, scalePow } from 'd3-scale'
const NUM_PICS = 50
const MAX_DELTA = 100

export default class HomePics extends React.PureComponent {

  state = {
    x: null,
    positions: [],
    width: 0,
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    const itemWidth = width ? width / NUM_PICS : 0
    const positions = range(NUM_PICS).map((pic, i) => {
      const pos = i * itemWidth
      return [pos, pos + itemWidth]
    })
    this.setState({width, positions, initialPositions: positions})
  }

  getColor = (i) => {
    const itemWidth = Math.round(255.0 / NUM_PICS)
    const col = itemWidth * i
    return `rgb(${col}, ${col}, ${col})`
  }

  getImage = (i) => {
    return `url(https://picsum.photos/200/700/?random&ts=${i})`
  }

  handleMouseMove = (e) => {
    // console.log(e.clientX)
    const { width, initialPositions } = this.state
    const leftScale = scaleLinear().domain([0, e.clientX]).range([MAX_DELTA, 0])
    const rightScale = scaleLinear().domain([0, width - e.clientX]).range([MAX_DELTA, 0])

    let lastDelta0 = 0
    let lastDelta1 = 0
    const newPositions = initialPositions.map((pos, i) => {
      let newPos0, newPos1
      if (pos[0] < e.clientX) {
        newPos0 = pos[0] - leftScale(e.clientX - pos[0])
        // newPos0 -= lastDelta0
      } else {
        newPos0 = pos[0] + rightScale(pos[0] - e.clientX)
        // newPos0 += lastDelta0
      }
      lastDelta0 = newPos0 - pos[0]

      if (pos[1] < e.clientX) {
        newPos1 = pos[1] - leftScale(e.clientX - pos[1])
        // newPos1 -= lastDelta1
      } else {
        newPos1 = pos[1] + rightScale(pos[1] - e.clientX)
        // newPos1 += lastDelta1
      }
      lastDelta1 = newPos1 - pos[1]

      return [newPos0, newPos1]

    })

    // console.log(newPositions)
    this.setState({ positions: newPositions })
  }

  handleMouseOut = (e) => {
    this.setState({
      x: null,
      positions: this.state.initialPositions,
    })
  }

  render() {
    const { positions, initialPositions } = this.state
    const { docs } = this.props
    return (
      <div className="w-100 h-100" style={{ position: 'relative' }}
        onMouseOut={this.handleMouseOut}
        onMouseMove={this.handleMouseMove}
        >
        {positions.map((pos, i) => {
          return (
            <Motion
              key={i}
              defaultStyle={{
                left: initialPositions[i][0],
                width: initialPositions[i][1] - initialPositions[i][0]
              }}
              style={{
                left: spring(positions[i][0]),
                width: spring(positions[i][1] - positions[i][0]),
              }}
              >
                {({ left, width }) => (
                  <div key={i} className='h-100' style={{
                    position: 'absolute',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    // border: '1px solid white',
                    // zIndex: i,
                    // backgroundColor:
                    // backgroundImage: this.getImage(i),
                    backgroundImage: `url(${docs[i].snapshot})`,
                    left,
                    width,
                    // left: pos[0],
                    // width: pos[1] - pos[0],
                    // right: pos[1]
                  }} />
                )}
              </Motion>
          )
        })}
      </div>

    )
  }
}
