import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import {
  getTimelineYearsWithEvents,
  getTimelineTopScale,
  getTimelineCurrentDate,
  getEventsExtent,
  WIDTH_WITH_EVENTS,
} from '../state/selectors'
import TimelineNavigation from './TimelineNavigation'
import TimelineFilters from './TimelineFilters'
import { last, get } from 'lodash'
import { Motion, spring } from 'react-motion'
import MultiText from '../components/MultiText'
import { DraggableCore } from 'react-draggable'
import { setDateTimeline, selectEvent } from '../state/actions'
import { getEventColor } from '../utils'

const TIMELINE_PADDING = 30
const EVENT_WIDTH = 150
const EVENT_RADIUS = 8

class EventItem extends PureComponent {
  render() {
    const { event, selectEvent, scale, height, enterEvent, leaveEvent } = this.props

    let eventHeight = 0
    const snapshot = get(event, 'documents[0].snapshot')

    if (snapshot) {
      const thumbnailHeight = get(event, 'documents[0].data.thumbnail_height', 0)
      const thumbnailWidth = get(event, 'documents[0].data.thumbnail_width', 0)
      eventHeight = thumbnailHeight * EVENT_WIDTH / thumbnailWidth
    }

    let y2 = 10

    if (!event.displacementIndex) {
      y2 = eventHeight ? height / 2 + eventHeight / 2 : height / 2
    } else {
      const k = event.displacementIndex % 2 === 0 ? 2 : 5
      y2 = eventHeight ? height / 8 * k + eventHeight / 8 * k : height / 8 * k
      if ((y2 - eventHeight) < 0) {
        y2 += Math.abs(y2 - eventHeight) + 80
      }
    }

    const color = getEventColor(event)

    return (
      <g
        onClick={() => selectEvent(event)}
        onMouseEnter={() => enterEvent(event)}
        onMouseLeave={() => leaveEvent(event)}>

        {eventHeight && (
          <g className="timeline-g-click" transform={`translate(${scale(event.startDate)}, ${y2-eventHeight- EVENT_RADIUS*3})`}>
            <g transform={'translate(10, 0)'}>
                <MultiText spacing={20} y={40+eventHeight} className="timeline-event-title" text={event.data.title} maxLen={25}></MultiText>
                <text className="timeline-event-date">{event.data.start_date}</text>
                <text dy={20+eventHeight} fill={color} className="timeline-event-category">{event.data.category_label}</text>
            </g>
            <image xlinkHref={snapshot} x={1} y={EVENT_RADIUS}  width={EVENT_WIDTH} height={eventHeight}/>
          </g>
        )}

        {!eventHeight && (
          <g className="timeline-g-click" transform={`translate(${scale(event.startDate)+10}, ${y2})`}>
            <MultiText spacing={20} y={40} className="timeline-event-title" text={event.data.title} maxLen={25}></MultiText>
            <text className="timeline-event-date">{event.data.start_date}</text>
            <text dy={20} fill={color} className="timeline-event-category">{event.data.category_label}</text>
          </g>
        )}

        <line  x1={scale(event.startDate)} x2={scale(event.startDate)} y1={0} y2={y2} stroke={color}></line>
        <circle cx={scale(event.startDate)} cy={y2} fill={color} fillOpacity={0.4} r={EVENT_RADIUS}></circle>
        <circle  cx={scale(event.startDate)} cy={y2} stroke={color} fill={color} r={EVENT_RADIUS/2}></circle>
      </g>
    )
  }
}

const mapStateToProps = state => ({
  years: getTimelineYearsWithEvents(state),
  scale: getTimelineTopScale(state),
  currentDate: getTimelineCurrentDate(state),
  extent: getEventsExtent(state),
})

const TimelineEvents = connect(mapStateToProps, { setDateTimeline, selectEvent })(class extends PureComponent {

  state = {
    height: 0,
    overEvent: null,
  }

  enterEvent = event => this.setState({ overEvent: event })

  leaveEvent = event => this.setState({ overEvent: null })

  componentDidMount() {
    this.setHeight()
    window.addEventListener('resize', this.setHeight, false)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setHeight)
  }

  setHeight = () => {
    const node = ReactDOM.findDOMNode(this)
    const height = node.offsetHeight
    this.setState({height})
  }

  onDrag = (e, data) => {
    const { scale, currentDate, setDateTimeline, extent } = this.props
    const x = scale(currentDate)
    const newX = x - data.deltaX
    const newDate = scale.invert(newX)
    if (newDate < extent[0] || newDate > extent[1]) { return }
    setDateTimeline(newDate)
  }

  render(){
    const { years, scale, currentDate, selectEvent } = this.props
    const { height = 0, overEvent } = this.state
    const width = last(scale.range()) + TIMELINE_PADDING * 2 + WIDTH_WITH_EVENTS
    const x = -scale(currentDate)

    return (
      <div className="h-100">
      <Motion defaultStyle={{x: 0}} style={{x: spring(x)}}>
      {({x})=>(
        <DraggableCore
          handle=".handle"
          onDrag={this.onDrag}
        >
        <svg className="h-100 handle" width={width} style={{transform:`translate(${x}px,0)`}}>
          <g transform={`translate(${TIMELINE_PADDING},0)`}>
          {years.map(year => (
            <g key={year.year} >
              <text className="timeline-nav-tick fill-grey" x={scale(year.date)} y={32}>{year.year}</text>
              {year.events.map((event, eventIndex) => (
                (overEvent && overEvent.id === event.id)
                  ? null
                  : (
                    <EventItem
                      enterEvent={this.enterEvent}
                      leaveEvent={this.leaveEvent}
                      event={event}
                      key={event.id}
                      selectEvent={selectEvent}
                      scale={scale}
                      height={height}
                    />
                  )
              ))}
            </g>
          ))}
          {overEvent && (
            <EventItem
              enterEvent={this.enterEvent}
              leaveEvent={this.leaveEvent}
              event={overEvent}
              selectEvent={selectEvent}
              scale={scale}
              height={height}
            />
          )}
          </g>
        </svg>
        </DraggableCore>
      )}
      </Motion>
      </div>
    )
  }
})

export default class Timeline extends PureComponent {
  render() {
    const { style, className } = this.props
    return (
      <div className={`d-flex flex-column ${className}`} style={style}>
        <TimelineFilters />
        {/* top timeline */}
        <div className="align-self-stretch flex-1 w-100 bg-black" style={{height:52, overflow:'hidden'}}>
          <TimelineEvents/>
        </div>

        {/* bottom timeline */}
        <TimelineNavigation />
      </div>
    )
  }
}
