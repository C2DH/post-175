import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  getTimelineYearsWithEvents,
  getTimelineTopScale,
  getTimelineCurrentDate,
} from '../state/selectors'
import TimelineNavigation from './TimelineNavigation'
import { scaleTime } from 'd3-scale'
import { last } from 'lodash'
import { Motion, spring } from 'react-motion'


class Timeline extends PureComponent {
  render() {
    const { years, scale, currentDate } = this.props
    const width = last(scale.range())
    const x = scale(currentDate)

    return (
      <div className='col-md-9 d-flex flex-column'>

        {/* top timeline */}
        <div className="align-self-start w-100 " style={{height:52, overflow:'hidden', backgroundColor:'#222'}}>
          <Motion defaultStyle={{x: 0}} style={{x: spring(x)}}>
          {({x})=>(
            <svg className="h-100" width={width} style={{transform:`translate(${-x}px,0)`}}>
              { years.map(year => (
                <text className="timeline-nav-tick" key={year.year} x={scale(year.date)} y={32}>{year.year}</text>
              )) }
            </svg>
          )}

          </Motion>

        </div>


        <div className="bg-secondary align-self-stretch flex-1 position-relative" style={{overflow:'hidden'}}>

          <div className="position-absolute bg-primary" style={{width:30000, height:100}}>

          </div>

        </div>

        {/* bottom timeline */}
        <TimelineNavigation />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  years: getTimelineYearsWithEvents(state),
  scale: getTimelineTopScale(state),
  currentDate: getTimelineCurrentDate(state),
})
export default connect(mapStateToProps)(Timeline)
