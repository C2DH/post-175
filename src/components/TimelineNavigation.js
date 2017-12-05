import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getEvents, getEventsExtent, getTimelineCurrentDate } from '../state/selectors'
import { setDateTimeline } from '../state/actions'
import { scaleTime } from 'd3-scale'
import { timeYear } from 'd3-time'
import { DraggableCore } from 'react-draggable'
import { Motion, spring, presets } from 'react-motion'

const years = ['1810', '1820', '1830', '1840', '1850', '1860', '1870', '1880', '1890', '1900', '1910', '1920', '1930']

const NAVIGATION_PADDING = 30
const CURSOR_WITH = NAVIGATION_PADDING / 2


const cursorStateToProps = state => ({
  currentDate: getTimelineCurrentDate(state),
  extent: getEventsExtent(state),
})

const TimelineCursor = connect(cursorStateToProps, { setDateTimeline })(class extends PureComponent {


  handleDrag = (e, data) => {
    const { scale } = this.props
    const newDate = scale.invert(data.x + CURSOR_WITH / 2)
    this.props.setDateTimeline(newDate)
  }

  onDrag = (e, data) => {
    console.log("xxxxxx")
    const { scale, currentDate, setDateTimeline, extent } = this.props
    const x = scale(currentDate)
    const newX = x + data.deltaX
    const newDate = scale.invert(newX)
    if (newDate < extent[0] || newDate > extent[1]) { return }
    setDateTimeline(newDate)
  }

  render(){
    const { currentDate, scale, height } = this.props
    const x = scale(currentDate) - CURSOR_WITH / 2
    return (
      // <Motion defaultStyle={{x: 0}} style={{x: spring(x, presets.stiff)}}>
      // { ({x})=>(
        <DraggableCore
          // axis="x"
          handle=".handle"
          // bounds={{left:scale.range()[0]- CURSOR_WITH / 2, right:scale.range()[1] - CURSOR_WITH / 2}}
          // position={{x: x, y:0}}
          onDrag={this.onDrag}
          >
            <svg height={height + CURSOR_WITH / 2 }
              transform={`translate(${x},0)`}
              width={CURSOR_WITH} style={{marginTop: -CURSOR_WITH/2}}>
              <line x1={CURSOR_WITH/2} y1={CURSOR_WITH/2} x2={CURSOR_WITH/2} y2={height + CURSOR_WITH / 2} stroke="red"></line>
              <circle className="handle"  r={CURSOR_WITH/2} cx={CURSOR_WITH/2} cy={CURSOR_WITH/2} fill="red"></circle>
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
        className="align-self-end bg-dark w-100 d-flex flex-column"
        style={{height:100}}>
        <div className="d-inline-flex flex-1 w-100">
          {/* {years.map((year, i)=> (
            <span key={i} className="text-light ml-3 mr-3">.</span>
          ))} */}
          <svg className="w-100 h-100" style={{backgroundColor:'#383838'}}>
            { events.map(event => (
              <circle key={event.id} cx={scale(event.startDate)} r={5} cy={height/4}></circle>
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
export default connect(mapStateToProps, {

})(TimelineNavigation)
