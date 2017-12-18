import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { defaultMemoize } from 'reselect'
import { scaleTime } from 'd3-scale'
import { timeYear } from 'd3-time'
import { DraggableCore } from 'react-draggable'
import { Motion, spring, presets } from 'react-motion'
import { getEventColor } from '../utils'

const NAVIGATION_PADDING = 30
const CURSOR_RADIUS = NAVIGATION_PADDING / 2

class TimelineCursor extends PureComponent {
  onDrag = (e, data) => {
    const { scale, currentDate, onDateChange, extent } = this.props
    const x = scale(currentDate)
    const newX = x + data.deltaX
    const newDate = scale.invert(newX)
    const scaleDomain = scale.domain()
    if (newDate < scaleDomain[0] || newDate > extent[1]) { return }
    onDateChange(newDate)
  }

  render() {
    const { currentDate, scale, height, cursorRadius } = this.props
    const x = scale(currentDate) - cursorRadius
    return (
      <Motion defaultStyle={{x: x}} style={{x: spring(x, { precision: 0.01, stiffness:580, damping:40})}}>
      { ({x})=>(
        <DraggableCore
          handle=".timeline-handle"
          onDrag={this.onDrag}
          >
            <svg height={height + cursorRadius }
              transform={`translate(${x},0)`}
              width={cursorRadius*2} style={{marginTop: -cursorRadius}}>
              <line x1={cursorRadius} y1={cursorRadius} x2={cursorRadius} y2={height + cursorRadius} stroke="white"></line>
              <circle className="timeline-handle" r={cursorRadius} cx={cursorRadius} cy={cursorRadius} fill="white" fillOpacity={0.4}></circle>
              <circle className="timeline-handle" r={cursorRadius/2} cx={cursorRadius} cy={cursorRadius} fill="white"></circle>
            </svg>
        </DraggableCore>
      )}
      </Motion>
    )

  }
}

export class TimelineTicks extends PureComponent {
  render() {
    const { ticks, scale, y } = this.props
    return (
      <svg className="w-100 bg-darkgrey flex-1">
        {ticks.map(tick=> (
          <text key={tick} x={scale(tick)} y={y} className="timeline-nav-tick fill-white">{tick.getFullYear()}</text>
        ))}
      </svg>
    )
  }
}

export class TimelineEvents extends PureComponent {
  render() {
    const { events, scale, cy, onClick } = this.props
    return (
      <svg className="w-100 bg-darkgrey flex-1">
        {events.map(event => (
          <circle
            className='pointer'
            onClick={() => onClick(event)}
            fill={getEventColor(event)}
            key={event.id}
            cx={scale(event.startDate)}
            r={5}
            cy={cy}
          />
        ))}
      </svg>
    )
  }
}

const getScale = defaultMemoize((extent, width, padding) => {
  const scale = scaleTime()
    .domain(extent)
    .range([padding, width - padding])
    .nice(timeYear, 10)
  return scale
})

const getTicks = defaultMemoize(scale => scale.ticks(timeYear.every(10)))

class TimelineNavigationControlled extends PureComponent {
  state = {
    width: 0,
    height: 0,
  }

  componentDidMount() {
    this.getDimensions()
    window.addEventListener('resize', this.getDimensions, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getDimensions)
  }

  getDimensions = () => {
    // Get dimensions of current container
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    const height = node.offsetHeight
    this.setState({ width, height })
  }

  render() {
    const { width, height } = this.state
    const {
      extent,
      padding,
      style,
      className,
      children,
      currentDate,
      onDateChange,
      cursorRadius,
    } = this.props

    const scale = getScale(extent, width, padding)
    const ticks = getTicks(scale)

    return (
      <div
        className={classNames('timeline-nav bg-dark w-100 d-flex flex-column', className)}
        style={{ height: 100, ...style }}>

        {children && children({ scale, ticks, width, height })}

        <div className="position-absolute">
          <TimelineCursor
            currentDate={currentDate}
            onDateChange={onDateChange}
            cursorRadius={cursorRadius}
            height={height}
            extent={extent}
            scale={scale}
          />
        </div>

      </div>
    )
  }
}

TimelineNavigationControlled.defaultProps = {
  padding: NAVIGATION_PADDING,
  cursorRadius: CURSOR_RADIUS,
}

export default TimelineNavigationControlled
