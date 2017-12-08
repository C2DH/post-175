import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { defaultMemoize } from 'reselect'
import { scaleTime } from 'd3-scale'

const getScale = defaultMemoize((extent, width, padding) => {
  const scale = scaleTime()
    .domain(extent)
    .range([padding, width - padding])
  return scale
}

class PlaceOpeningTimeline extends PureComponent {
  state = {
    width: 0,
  }

  componentDidMount() {
    // Get width of current container
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    this.setState({ width })
  }

  render() {
    // return (
    //   <svg className='w-100' style={{ height: 20 }}>
    //     <line x1={0} x2={0}
    //
    //   </svg>
    // )
  }
}

export default PlaceOpeningTimeline
