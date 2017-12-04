import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { loadEvents, unloadEvents } from '../state/actions'
import { getEvents } from '../state/selectors'
import Period from '../components/Period'
import TimelineNavigation from '../components/TimelineNavigation'
import Timeline from '../components/Timeline'

class TimelinePage extends PureComponent {
  componentDidMount() {
    this.props.loadEvents()
  }

  componentWillUnmount() {
    this.props.unloadEvents()
  }

  render() {
    const { events } = this.props
    console.log(events)
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
})
export default connect(mapStateToProps, {
  loadEvents,
  unloadEvents,
})(TimelinePage)
