import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { uniq } from 'lodash'
import {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
  unloadTimeline,
} from '../state/actions'
import { getEvents, getPeriods, getSelectedEvent } from '../state/selectors'
import Period from '../components/Period'
import TimelineNavigation from '../components/TimelineNavigation'
import Timeline from '../components/Timeline'

class TimelinePage extends PureComponent {
  componentDidMount() {
    this.props.loadEvents()
    this.props.loadPeriods()
  }

  componentWillUnmount() {
    this.props.unloadEvents()
    this.props.unloadPeriods()
    this.props.unloadTimeline()
  }

  render() {
    const { events, periods, selectedEvent } = this.props
    console.log(selectedEvent)
    return (
      <div className='h-100vh d-flex flex-column'>
        <div className='row no-gutters flex-1'>

          {periods && events && <Period />}
          {events && <Timeline />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: getEvents(state),
  periods: getPeriods(state),
  selectedEvent: getSelectedEvent(state),
})
export default connect(mapStateToProps, {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
  unloadTimeline,
})(TimelinePage)
