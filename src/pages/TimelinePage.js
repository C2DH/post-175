import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { uniq } from 'lodash'
import {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
  unloadTimeline,
  clearSelectedEvent,
  selectEvent,
  setDateTimeline,
} from '../state/actions'
import {
  getEvents,
  getPeriods,
  getSelectedEvent,
  getTimelinePrevEvent,
  getTimelineNextEvent,
} from '../state/selectors'
import Period from '../components/Period'
import TimelineNavigation from '../components/TimelineNavigation'
import Timeline from '../components/Timeline'
import { Motion, spring } from 'react-motion'
import EventModal from '../components/EventModal'

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

  goNext = () => {
    const { selectEvent, setDateTimeline, nextEvent } = this.props
    setDateTimeline(nextEvent.startDate)
    selectEvent(nextEvent)
  }

  goPrev = () => {
    const { selectEvent, setDateTimeline, prevEvent } = this.props
    setDateTimeline(prevEvent.startDate)
    selectEvent(prevEvent)
  }

  render() {
    const { events, periods, selectedEvent, nextEvent, prevEvent, clearSelectedEvent } = this.props
    return (
      <div className='h-100vh d-flex flex-column'>
        <div className='row no-gutters flex-1'>
          {periods && events && <Motion defaultStyle={{o:0}} style={{o: spring(1)}}>
            {({o}) => (
              <Period style={{opacity:o}}/>
            )}
          </Motion> }
          {events && <Motion defaultStyle={{o:0}} style={{o: spring(1)}}>
            {({o}) => (
              <Timeline style={{opacity:o}} />
            )}
          </Motion> }
          {selectedEvent && <EventModal
            hasNext={nextEvent !== null}
            hasPrev={prevEvent !== null}
            goNext={this.goNext}
            goPrev={this.goPrev}
            event={selectedEvent}
            onClose={clearSelectedEvent}
           />}

        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  events: getEvents(state),
  periods: getPeriods(state),
  selectedEvent: getSelectedEvent(state),
  nextEvent: getTimelineNextEvent(state),
  prevEvent: getTimelinePrevEvent(state),
})
export default connect(mapStateToProps, {
  loadEvents,
  unloadEvents,
  loadPeriods,
  unloadPeriods,
  unloadTimeline,
  setDateTimeline,
  clearSelectedEvent,
  selectEvent,
})(TimelinePage)
