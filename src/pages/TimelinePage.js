import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
} from '../state/actions'
import { getEvents, getPeriods, getEventsExtent } from '../state/selectors'
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
  }

  render() {
    const { events, periods, extent } = this.props
    console.log(events, periods, extent)
    return (
      <div className='h-100vh d-flex flex-column'>
        <div className='row no-gutters flex-1'>
          <Period />
          <Timeline />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: getEvents(state),
  extent: getEventsExtent(state),
  periods: getPeriods(state),
})
export default connect(mapStateToProps, {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
})(TimelinePage)
