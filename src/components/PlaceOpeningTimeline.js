import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { defaultMemoize } from 'reselect'
import { scaleTime } from 'd3-scale'
import { getPlacesExtent } from '../state/selectors'

const HEIGHT = 60
const END_BAR_HEIGHT = 12

const getScale = defaultMemoize((extent, width, padding = 0) => {
  const scale = scaleTime()
    .domain(extent)
    .range([padding, width - padding])
  return scale
})

class PlaceOpeningTimeline extends PureComponent {
  state = {
    width: 0,
  }

  componentDidMount() {
    // Get width of current container
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    console.log({ node })
    this.setState({ width })
  }

  render() {
    const { width } = this.state
    const { openDate, closeDate, extent } = this.props
    const scale = getScale(extent, width, 10)
    const range = scale.range()
    console.log((HEIGHT / 3 * 2))
    console.log((HEIGHT / 3 * 2) - (END_BAR_HEIGHT / 2))
    console.log((HEIGHT / 3 * 2) + (END_BAR_HEIGHT / 2))

    return (
      <div className='w-100' style={{ backgroundColor: '#ccc' }}>
        <svg width={width} height={HEIGHT}>

          {/* main lines */}
          <line
            x1={range[0]}
            x2={range[1]}
            y1={HEIGHT / 3 * 2}
            y2={HEIGHT / 3 * 2}
            className='opening-timeline-line'
          />
          <line
            x1={scale(openDate)}
            x2={scale(closeDate)}
            y1={HEIGHT / 3 * 2}
            y2={HEIGHT / 3 * 2}
            className='opening-timeline-openline'
          />

          {/* start / end indicators */}
          <circle cx={scale(openDate)} cy={HEIGHT / 3 * 2} r={5} className='opening-timeline-start' />
          <line
            x1={scale(closeDate)}
            x2={scale(closeDate)}
            y1={(HEIGHT / 3 * 2) - (END_BAR_HEIGHT / 2)}
            y2={(HEIGHT / 3 * 2) + (END_BAR_HEIGHT / 2)}
            className='opening-timeline-end'
          />

          {/* Bottom text extent */}
          <text
            x={0}
            y={(HEIGHT / 3 * 2) + 20}
            className='opening-timeline-text'
          >{extent[0].getFullYear()}</text>
          <text
            x={range[1] - 15}
            y={(HEIGHT / 3 * 2) + 20}
            className='opening-timeline-text'
          >{extent[1].getFullYear()}</text>


          <text
            x={scale(openDate) - 10}
            y={(HEIGHT / 3 * 2) - 25}
            className='opening-timeline-text'
          >
            <tspan x={scale(openDate) - 10}>Opening</tspan>
            <tspan x={scale(openDate) - 10} dy={10}>{openDate.getFullYear()}</tspan>
          </text>

          <text
            x={scale(closeDate)}
            y={(HEIGHT / 3 * 2) - 25}
            className='opening-timeline-text'
          >
            <tspan dx={0} dy={0}>Closed</tspan>
            <tspan dx={5} dy={12}>{closeDate.getFullYear()}</tspan>
          </text>

        </svg>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  extent: getPlacesExtent(state),
})
export default connect(mapStateToProps)(PlaceOpeningTimeline)
