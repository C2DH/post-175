import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getEvents, getEventsExtent, getTimelineCurrentDate } from '../state/selectors'
import { setDateTimeline } from '../state/actions'
import { getEventColor } from '../utils'
import { scaleTime } from 'd3-scale'
import { timeYear } from 'd3-time'
import { DraggableCore } from 'react-draggable'
import { Motion, spring, presets } from 'react-motion'

const NAVIGATION_PADDING = 30
const CURSOR_RADIUS = NAVIGATION_PADDING / 2


const cursorMapStateToProps = state => ({
  currentDate: getTimelineCurrentDate(state),
  extent: getEventsExtent(state),
})

const TimelineCursor = connect(cursorMapStateToProps, { setDateTimeline })(class extends PureComponent {
  onDrag = (e, data) => {
    const { scale, currentDate, setDateTimeline, extent } = this.props
    const x = scale(currentDate)
    const newX = x + data.deltaX
    const newDate = scale.invert(newX)
    if (newDate < extent[0] || newDate > extent[1]) { return }
    setDateTimeline(newDate)
  }

  render(){
    const { currentDate, scale, height } = this.props
    const x = scale(currentDate) - CURSOR_RADIUS
    return (
      // <Motion defaultStyle={{x: 0}} style={{x: spring(x, presets.stiff)}}>
      // { ({x})=>(
        <DraggableCore
          handle=".timeline-handle"
          onDrag={this.onDrag}
          >
            <svg height={height + CURSOR_RADIUS }
              transform={`translate(${x},0)`}
              width={CURSOR_RADIUS*2} style={{marginTop: -CURSOR_RADIUS}}>
              <line x1={CURSOR_RADIUS} y1={CURSOR_RADIUS} x2={CURSOR_RADIUS} y2={height + CURSOR_RADIUS} stroke="white"></line>
              <circle className="timeline-handle" r={CURSOR_RADIUS} cx={CURSOR_RADIUS} cy={CURSOR_RADIUS} fill="white" fillOpacity={0.4}></circle>
              <circle className="timeline-handle" r={CURSOR_RADIUS/2} cx={CURSOR_RADIUS} cy={CURSOR_RADIUS} fill="white"></circle>
            </svg>
        </DraggableCore>
      // )}
      // </Motion>
    )

  }
})


class TimelineNavigation extends PureComponent {

  state = {
    width: 0,
    height: 0,
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this)
    const width = node.offsetWidth
    const height = node.offsetHeight
    this.setState({width, height})
  }

  render() {
    const { width, height } = this.state
    const { extent, events } = this.props

    const scale = scaleTime()
      .domain(extent)
      .range([NAVIGATION_PADDING, width - NAVIGATION_PADDING])
      .nice(timeYear, 10)

    const ticks = scale.ticks(timeYear.every(10))

    return (
      <div
        className="timeline-nav align-self-end bg-dark w-100 d-flex flex-column"
        style={{height:100}}>
        <div className="d-inline-flex flex-1 w-100">
          <svg className="w-100 h-100" style={{backgroundColor:'#383838'}}>
            { events.map(event => (
              <circle fill={getEventColor(event)} key={event.id} cx={scale(event.startDate)} r={5} cy={height/4}></circle>
            ))}
          </svg>
        </div>
        <div className="d-inline-flex flex-1 w-100">
          <svg className="w-100 h-100" style={{backgroundColor:'#383838'}}>
            { ticks.map(tick=> (
              <text key={tick} x={scale(tick)} y={height/4} className="timeline-nav-tick">{tick.getFullYear()}</text>
            ))}
          </svg>
        </div>

        <div className="position-absolute">
          <TimelineCursor height={height} scale={scale}/>
        </div>


      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: getEvents(state),
  extent: getEventsExtent(state),
})
export default connect(mapStateToProps)(TimelineNavigation)
