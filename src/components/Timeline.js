import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import {
  getTimelineYearsWithEvents,
  getTimelineTopScale,
  getTimelineCurrentDate,
  getEventsExtent,
} from '../state/selectors'
import TimelineNavigation from './TimelineNavigation'
import { last, get } from 'lodash'
import { Motion, spring } from 'react-motion'
import MultiText from '../components/MultiText'
import { DraggableCore } from 'react-draggable'
import { setDateTimeline, selectEvent } from '../state/actions'
import { getEventColor } from '../utils'

const TIMELINE_PADDING = 30
const EVENT_WIDTH = 100
const EVENT_RADIUS = 8

const mapStateToProps = state => ({
  years: getTimelineYearsWithEvents(state),
  scale: getTimelineTopScale(state),
  currentDate: getTimelineCurrentDate(state),
  extent: getEventsExtent(state),
})

const TimelineEvents = connect(mapStateToProps, { setDateTimeline, selectEvent })(class extends PureComponent {

  state = {
    height: 0,
  }

  componentDidMount(){
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
    const { height=0 } = this.state
    const width = last(scale.range()) + TIMELINE_PADDING * 2
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
          { years.map(year => (
            <g key={year.year} >
              <text className="timeline-nav-tick fill-grey" x={scale(year.date)} y={32}>{year.year}</text>
              { year.events.map((event, eventIndex) => {

                let eventHeight = 0
                if(event.snapshot){
                  const thumbnailHeight = get(event, 'data.thumbnail_height', 0)
                  const thumbnailWidth = get(event, 'data.thumbnail_width', 0)
                  eventHeight = thumbnailHeight * EVENT_WIDTH / thumbnailWidth
                }

                const numEvents = year.events.length
                let y2 = 10

                if(!event.displacementIndex){
                  y2 = eventHeight ? height / 2 + eventHeight / 2 : height / 2
                } else {
                  const k = event.displacementIndex % 2 === 0 ? 1 : 3
                  y2 = eventHeight ? height / 4 * k + eventHeight / 4 * k : height / 4 * k
                  // y2 -= height / 10
                }

                const color = getEventColor(event)

                return (<g key={event.id}>
                  <line  x1={scale(event.startDate)} x2={scale(event.startDate)} y1={0} y2={y2} stroke={color}></line>
                  <circle cx={scale(event.startDate)} cy={y2} fill={color} fillOpacity={0.4} r={EVENT_RADIUS}></circle>
                  <circle onClick={() => selectEvent(event)} cx={scale(event.startDate)} cy={y2} stroke={color} fill={color} r={EVENT_RADIUS/2}></circle>

                  { eventHeight && (
                    <g transform={`translate(${scale(event.startDate)}, ${y2-eventHeight- EVENT_RADIUS*3})`}>
                      <g transform={'translate(10, 0)'}>
                          <text className="timeline-event-date">{event.data.start_date}</text>
                          <text dy={20+eventHeight} fill={color} className="timeline-event-category">{event.data.category}</text>
                          <MultiText y={40+eventHeight} className="timeline-event-title" text={event.data.title} maxLen={30}></MultiText>
                      </g>
                      <image href={event.snapshot} x="1" y={EVENT_RADIUS}  width={EVENT_WIDTH}/>
                    </g>

                  )}

                  { !eventHeight && (
                    <g transform={`translate(${scale(event.startDate)+10}, ${y2})`}>
                      <text className="timeline-event-date">{event.data.start_date}</text>
                      <text dy={20} fill={color} className="timeline-event-category">{event.data.category}</text>
                      <MultiText y={40} className="timeline-event-title" text={event.data.title} maxLen={30}></MultiText>
                    </g>
                  ) }

                </g>)
              }) }
            </g>

          )) }
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
    const { style } = this.props
    return (
      <div className='col-md-9 d-flex flex-column' style={style}>
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
