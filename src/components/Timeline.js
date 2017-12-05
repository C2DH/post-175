import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import {
  getTimelineYearsWithEvents,
  getTimelineTopScale,
  getTimelineCurrentDate,
} from '../state/selectors'
import TimelineNavigation from './TimelineNavigation'
import { scaleTime } from 'd3-scale'
import { last, get } from 'lodash'
import { Motion, spring } from 'react-motion'
import MultiText from '../components/MultiText'

const TIMELINE_PADDING = 30
const EVENT_WIDTH = 200

const mapStateToProps = state => ({
  years: getTimelineYearsWithEvents(state),
  scale: getTimelineTopScale(state),
  currentDate: getTimelineCurrentDate(state),
})

const TimelineEvents = connect(mapStateToProps)(class extends PureComponent {

  state = {
    height: 0,
  }

  componentDidMount(){
    const node = ReactDOM.findDOMNode(this)
    const height = node.offsetHeight
    this.setState({height})
    console.log("height", height, node)
  }

  render(){
    const { years, scale, currentDate } = this.props
    const { height=0 } = this.state
    const width = last(scale.range()) + TIMELINE_PADDING * 2
    const x = -scale(currentDate)

    return (
      <div className="h-100">
      <Motion defaultStyle={{x: 0}} style={{x: spring(x)}}>
      {({x})=>(
        <svg className="h-100" width={width} style={{transform:`translate(${x}px,0)`}}>
          <g transform={`translate(${TIMELINE_PADDING},0)`}>
          { years.map(year => (
            <g key={year.year} >
              <text className="timeline-nav-tick" x={scale(year.date)} y={32}>{year.year}</text>
              { year.events.map(event => {

                let eventHeight = 0
                if(event.snapshot){
                  const thumbnailHeight = get(event, 'data.thumbnail_height', 0)
                  const thumbnailWidth = get(event, 'data.thumbnail_height', 0)
                  eventHeight = thumbnailHeight * EVENT_WIDTH / thumbnailWidth
                }

                const y2 = eventHeight ? height / 2 + eventHeight / 2 : height / 2


                return (<g key={event.id}>
                  <line  x1={scale(event.startDate)} x2={scale(event.startDate)} y1={0} y2={y2} stroke={'#fff'}></line>
                  <circle cx={scale(event.startDate)} cy={y2} fill={'#fff'} fillOpacity={0.4} r={8}></circle>
                  <circle cx={scale(event.startDate)} cy={y2} stroke={'#fff'} fill={'#fff'} r={4}></circle>

                  <g transform={`translate(${scale(event.startDate)+10}, ${y2})`}>
                    <text className="timeline-event-date">{event.data.start_date}</text>
                    <text dy={20} className="timeline-event-category">{event.data.category}</text>
                    <MultiText y={40} className="timeline-event-title" text={event.data.title} maxLen={20} numItems={4}></MultiText>
                  </g>

                </g>)
              }) }
            </g>

          )) }
          </g>
        </svg>
      )}
      </Motion>
      </div>
    )
  }
})

export default class Timeline extends PureComponent {
  render() {

    return (
      <div className='col-md-9 d-flex flex-column'>

        {/* top timeline */}
        <div className="align-self-stretch flex-1  w-100 " style={{height:52, overflow:'hidden', backgroundColor:'#222'}}>

          <TimelineEvents/>
        </div>



        {/* bottom timeline */}
        <TimelineNavigation />
      </div>
    )
  }
}
