import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { getEvents, getEventsExtent } from '../state/selectors'
import { scaleTime } from 'd3-scale'

const years = ['1810', '1820', '1830', '1840', '1850', '1860', '1870', '1880', '1890', '1900', '1910', '1920', '1930']
const NAVIGATION_PADDING = 10


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


    return (
      <div
        className="align-self-end bg-dark w-100 d-flex flex-column"
        style={{height:100}}>
        <div className="d-inline-flex flex-1 w-100">
          {/* {years.map((year, i)=> (
            <span key={i} className="text-light ml-3 mr-3">.</span>
          ))} */}
          <svg className="w-100 h-100" style={{backgroundColor:'white'}}>
            { events.map(event => (
              <circle key={event.id} cx={scale(event.startDate)} r={5} cy={height/4}></circle>
            ))}
          </svg>
        </div>
        <div className="d-inline-flex flex-1 w-100">
          <svg className="w-100 h-100" style={{backgroundColor:'blue'}}>

          </svg>
          {/* {years.map((year, i)=> (
            <span key={i} className="text-light ml-3 mr-3">{year}</span>
          ))} */}
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
