import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { defaultMemoize } from 'reselect'
import { scaleTime } from 'd3-scale'
import { getPlacesRealExtent } from '../state/selectors'
import { localize } from '../localize'

const HEIGHT = 70
const END_BAR_HEIGHT = 12
const TIMELINE_Y = 45

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
    const { extent } = this.props
    const { t } = this.props
    const scale = getScale(extent, width, 20)
    const range = scale.range()

    // So bad is so good
    const openDate = this.props.openDate
      ? new Date(`${this.props.openDate.getFullYear()}`)
      : extent[0]
    const closeDate = this.props.closeDate
      ? new Date(`${this.props.closeDate.getFullYear()}`)
      : extent[1]
    const isOpen = closeDate.getFullYear() === extent[1].getFullYear()
    const openSuffix = isOpen ? 'open' : 'closed'

    return (
      <div className='w-100'>
        <svg width={width} height={HEIGHT}>

          {/* main lines */}
          <line
            x1={range[0]}
            x2={range[1]}
            y1={TIMELINE_Y}
            y2={TIMELINE_Y}
            className='opening-timeline-bgline'
          />
          <line
            x1={scale(openDate)}
            x2={scale(closeDate)}
            y1={TIMELINE_Y}
            y2={TIMELINE_Y}
            className={`opening-timeline-${openSuffix}`}
          />

          {/* start / end indicators */}
          <circle
            cx={scale(openDate)}
            cy={TIMELINE_Y}
            r={5}
            className={`opening-timeline-${openSuffix}`}
          />
          {!isOpen && <line
            x1={scale(closeDate)}
            x2={scale(closeDate)}
            y1={(TIMELINE_Y) - (END_BAR_HEIGHT / 2)}
            y2={(TIMELINE_Y) + (END_BAR_HEIGHT / 2)}
            className={`opening-timeline-${openSuffix}`}
          />}

          {/* Bottom text extent */}
          <text
            x={5}
            y={(TIMELINE_Y) + 20}
            className='opening-timeline-text'
          >{extent[0].getFullYear()}</text>
          <text
            x={range[1] - 15}
            y={(TIMELINE_Y) + 25}
            className='opening-timeline-text'
          >{extent[1].getFullYear()}</text>


          <text
            x={scale(openDate) - 10}
            y={(TIMELINE_Y) - 25}
            className='opening-timeline-text'
          >
            <tspan x={scale(openDate) - 20}>{t('map_mapTooltipOpen')}</tspan>
            <tspan x={scale(openDate) - 15} dy={12}>{openDate.getFullYear()}</tspan>
          </text>

          {!isOpen && <text
            x={scale(closeDate)}
            y={(TIMELINE_Y) - 25}
            className='opening-timeline-text'
          >
            <tspan x={scale(closeDate) - 20} >{t('map_mapTooltipClose')}</tspan>
            <tspan x={scale(closeDate) - 10} dy={12}>{closeDate.getFullYear()}</tspan>
          </text>}

        </svg>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  extent: getPlacesRealExtent(state),
})
export default localize()(connect(mapStateToProps)(PlaceOpeningTimeline))
