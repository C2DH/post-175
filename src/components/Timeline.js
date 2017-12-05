import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  getTimelineYearsWithEvents,
} from '../state/selectors'
import TimelineNavigation from './TimelineNavigation'

const WIDTH_WITH_EVENTS = 300
const WIDTH_NO_EVENTS = 100

class Timeline extends PureComponent {
  render() {
    const { years } = this.props
    console.log('~~', years)
    return (
      <div className='col-md-9 bg-light d-flex flex-column'>

        {/* top timeline */}
        <div className="align-self-start bg-warning w-100 " style={{height:52}}>

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
})
export default connect(mapStateToProps)(Timeline)
